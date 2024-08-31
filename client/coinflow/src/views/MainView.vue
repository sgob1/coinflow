<template>
  <div id="main-view">
    <div v-if="dataReady">
      <SummaryComponent
        :total-amount="balance[this.selectedUsername]"
        :user="this.selectedUsername"
        v-if="!searchModeOn"
      />
      <TransactionsFilterComponent
        :users="cachedUsers"
        @filters-changed="(filters) => this.$emit('filtersChanged', filters)"
      />
      <FloatingActionButtonComponent
        id="floating-action-button"
        @click="onFloatingActionButtonClick"
        v-if="!searchModeOn"
      />
      <TransactionsListComponent
        ref="searchComponent"
        :query="searchQuery"
        @edit-transaction="onEditTransaction"
        @delete-transaction="onDeleteTransaction"
        @see-user-transactions-click="
          (username) => this.$emit('seeUserTransactionsClick', username)
        "
      />
      <vue-bottom-sheet
        ref="bottomSheet"
        :max-width="1024"
        :max-height="800"
        :transition-duration="0.4"
        :overlay-color="'#00000048'"
      >
        <TransactionEditorComponent
          class="bottom-sheet-component"
          :transaction="targetTransaction"
          ref="transactionEditor"
          @transaction-submitted="onTransactionsModified"
        />
      </vue-bottom-sheet>
    </div>
  </div>
</template>

<script>
import SummaryComponent from '@/components/SummaryComponent.vue'
import fetcher from '@/utils/fetch/fetcher.js'
import searchUtils from '@/utils/search/searchUtils.js'

import VueBottomSheet from '@webzlodimir/vue-bottom-sheet'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'

import TransactionsListComponent from '@/components/TransactionsListComponent.vue'
import TransactionEditorComponent from '@/components/TransactionEditorComponent.vue'
import FloatingActionButtonComponent from '@/components/FloatingActionButtonComponent.vue'
import TransactionsFilterComponent from '@/components/TransactionsFilterComponent.vue'

import { mapState } from 'vuex'
import { h } from 'vue'

export default {
  components: {
    SummaryComponent,
    VueBottomSheet,
    TransactionEditorComponent,
    FloatingActionButtonComponent,
    TransactionsFilterComponent,
    TransactionsListComponent
  },
  data() {
    return {
      year: '',
      month: '',
      selectedUsername: '_total',
      transactions: [],
      balance: {},
      cachedUsers: {},
      dataReady: false,
      targetTransaction: undefined,
      searchModeOn: false,
      usersSearchResults: []
    }
  },
  computed: {
    ...mapState(['searchQuery']),
    currentYear() {
      return new Date().getFullYear()
    },
    currentMonth() {
      return new Date().getMonth()
    },
    filteredTransactions() {
      return searchUtils.searchFilters['user'].apply(this.transactions, this.selectedUsername)
    }
  },
  methods: {
    cloneTransaction(transaction) {
      let clone = {}
      clone.transactionId = transaction.transactionId
      clone.author = transaction.author
      clone.year = transaction.year
      clone.month = transaction.month
      clone.day = transaction.day
      clone.category = transaction.category
      clone.description = transaction.description
      clone.quotas = {}
      for (let quota in transaction.quotas) {
        clone.quotas[quota] = transaction.quotas[quota]
      }
      return clone
    },
    openEditor() {
      this.$refs.bottomSheet.open()
    },
    closeEditor() {
      this.$refs.bottomSheet.close()
    },
    onEditTransaction(transaction) {
      this.targetTransaction = this.cloneTransaction(transaction)
      this.openEditor()
    },
    onFloatingActionButtonClick() {
      this.targetTransaction = this.cloneTransaction({})
      this.openEditor()
    },
    async onDeleteTransaction(transaction) {
      if (confirm(`Really delete transaction '${transaction.description}'?`)) {
        await fetcher.deleteTransaction(transaction)
        this.onTransactionsModified()

        this.$snackbar.add({
          type: 'success',
          text: `Deleted transaction '${transaction.description}'`,
          // Render function for undo button
          action: h('button', {
            class: 'undo-button',
            type: 'button',
            onClick: () => {
              this.onUndoClick(transaction)
            },
            innerHTML: 'Undo'
          })
        })
      }
    },
    async onTransactionsModified() {
      this.closeEditor()
      this.dataReady = false
      this.getBudget()
      this.getBalance()
      this.dataReady = true
      await this.$refs.searchComponent.refresh()
    },
    async onUndoClick(transaction) {
      await fetcher.submitNewTransaction(transaction)
      await this.onTransactionsModified()
      this.$snackbar.add({
        type: 'success',
        text: `Undo delete transaction '${transaction.description}'`
      })
    },
    validYear(year) {
      if (isNaN(year) || year === '' || year < 1900) return false
      return true
    },
    validMonth(month) {
      if (isNaN(month) || month === '' || month < 1 || month > 12) return false
      return true
    },
    async monthlyBudget() {
      this.transactions = []
      const response = await fetch(`/api/budget/${this.year}/${this.month}`)
      if (response.ok) {
        this.transactions = await response.json()
      } else {
        console.log(`Invalid response: ${response}`)
      }
      return response
    },
    async yearlyBudget() {
      this.transactions = []
      const response = await fetch(`/api/budget/${this.year}`)
      if (response.ok) {
        this.transactions = await response.json()
      } else {
        console.log(`Invalid response: ${response}`)
      }
      return response
    },
    async alltimeBudget() {
      this.transactions = []
      const response = await fetch(`/api/budget/`)
      if (response.ok) {
        this.transactions = await response.json()
      } else {
        console.log(`Invalid response: ${response}`)
      }
      return response
    },
    async cacheUsersInBalance() {
      for (let item in this.balance) {
        if (!item.startsWith('_')) {
          const user = await this.findUserByUsername(item)
          if (user) {
            this.cachedUsers[user.username] = user
          }
        }
      }
      delete this.cachedUsers[this.$store.state.username]
    },
    async findUserByUsername(username) {
      if (this.cachedUsers[username]) return this.cachedUsers[username]
      const user = await fetcher.singleUserSearch(username)
      this.cachedUsers[username] = user
      return user
    },
    async getBudget() {
      if (this.validYear(this.year)) {
        if (this.validMonth(this.month)) {
          await this.monthlyBudget()
        } else {
          await this.yearlyBudget()
        }
      } else {
        await this.alltimeBudget()
      }
    },
    async getBalance() {
      this.balance = await fetcher.balance()
    }
  },
  async mounted() {
    await this.getBalance()
    await this.cacheUsersInBalance()
    this.dataReady = false
    this.getBudget()
    this.dataReady = true
  },
  watch: {
    searchQuery: async function (newVal, oldVal) {
      this.searchModeOn = newVal.trim().length > 0 ? true : false
    }
  }
}
</script>

<style>
#main-view {
  border: 1px solid #cccccc;
  padding: 8px;
  margin: 0px;
  max-width: 100%;
}

.bottom-sheet-component {
  min-height: 500px;
  display: flex;
  flex-direction: column;
}
</style>
