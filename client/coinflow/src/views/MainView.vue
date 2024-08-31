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
      <TransactionsListComponent
        ref="searchComponent"
        :query="searchQuery"
        @delete-transaction="onDeleteTransaction"
        @transaction-modified="onTransactionsModified"
        @see-user-transactions-click="
          (username) => this.$emit('seeUserTransactionsClick', username)
        "
      />
    </div>
  </div>
</template>

<script>
import SummaryComponent from '@/components/SummaryComponent.vue'
import fetcher from '@/utils/fetch/fetcher.js'
import searchUtils from '@/utils/search/searchUtils.js'

import TransactionsListComponent from '@/components/TransactionsListComponent.vue'
import TransactionsFilterComponent from '@/components/TransactionsFilterComponent.vue'

import { mapState } from 'vuex'
import { h } from 'vue'

export default {
  components: {
    SummaryComponent,
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
      searchModeOn: false,
      usersSearchResults: []
    }
  },
  computed: {
    ...mapState(['searchQuery']),
    filteredTransactions() {
      return searchUtils.searchFilters['user'].apply(this.transactions, this.selectedUsername)
    }
  },
  methods: {
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
</style>
