<template>
  <div id="main-view">
    <div v-if="dataReady">
      <SummaryComponent
        :total-amount="balance[this.selectedUsername]"
        :user="this.selectedUsername"
      />
      <div id="table-menu" class="transactions-table-menu">
        <input
          type="number"
          min="1900"
          max="2100"
          placeholder="Year"
          value="currentYear"
          v-model="year"
          @input="onOptionsChange"
        />
        <input
          type="number"
          min="1"
          max="12"
          placeholder="Month"
          value="currentMonth"
          v-model="month"
          @input="onOptionsChange"
        />
        <select v-model="selectedUsername">
          <option value="_total">Total balance</option>
          <option v-for="user in cachedUsers" :key="user.username">
            {{ user.username }}
          </option>
        </select>
      </div>
      <div id="main-table" class="transactions-table">
        <li
          v-for="transaction in filteredTransactions(this.selectedUsername)"
          :key="transaction.transactionId"
        >
          <TransactionItem
            :transaction="transaction"
            @edit-transaction="onEditTransaction"
            @delete-transaction="onDeleteTransaction"
          />
        </li>
      </div>
      <FloatingActionButtonComponent
        id="floating-action-button"
        @click="onFloatingActionButtonClick"
      />
      <vue-bottom-sheet
        ref="bottomSheet"
        :max-width="1024"
        :max-height="1000"
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
import TransactionItem from '@/components/TransactionItem.vue'
import fetcher from '@/utils/fetch/fetcher.js'

import VueBottomSheet from '@webzlodimir/vue-bottom-sheet'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'

import TransactionEditorComponent from '@/components/TransactionEditorComponent.vue'
import FloatingActionButtonComponent from '@/components/FloatingActionButtonComponent.vue'

import { h } from 'vue'

const undoButton = h(
  'button', // type
  {
    class: 'undo-button',
    type: 'button',
    onClick: () => {
      console.log('undo')
    },
    innerHTML: 'UNDO'
  } // props
)

export default {
  components: {
    SummaryComponent,
    TransactionItem,
    VueBottomSheet,
    TransactionEditorComponent,
    FloatingActionButtonComponent
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
      targetTransaction: undefined
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear()
    },
    currentMonth() {
      return new Date().getMonth()
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
    },
    onOptionsChange() {
      this.dataReady = false
      this.getBudget()
      this.dataReady = true
    },
    async onUndoClick(transaction) {
      await fetcher.submitNewTransaction(transaction)
      this.onTransactionsModified()
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
      const response = await fetch(`/api/budget/${this.year}/${this.month}`)
      if (response.ok) {
        this.transactions = await response.json()
      } else {
        console.log(`Invalid response: ${response}`)
      }
      return response
    },
    async yearlyBudget() {
      const response = await fetch(`/api/budget/${this.year}`)
      if (response.ok) {
        this.transactions = await response.json()
      } else {
        console.log(`Invalid response: ${response}`)
      }
      return response
    },
    async alltimeBudget() {
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
      const user = await fetcher.usersSearch(username)
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
    },
    filteredTransactions(username) {
      if (username === '_total') {
        return this.transactions
      }
      let filteredTransactions = []
      for (let transaction of this.transactions) {
        if (
          transaction.quotas[username] &&
          (transaction.author === this.$store.state.username || transaction.author === username)
        )
          filteredTransactions.push(transaction)
      }

      return filteredTransactions
    }
  },
  async mounted() {
    await this.getBalance()
    await this.cacheUsersInBalance()
    this.onOptionsChange()
  }
}
</script>

<style>
#main-view {
  background-color: #ffffff;
  border: 1px solid #cccccc;
  padding: 8px;
  margin: 0px;
  max-width: 100%;
}

.table-menu {
  display: flex;
  flex-direction: row;
}

.bottom-sheet-component {
  min-height: 500px;
  display: flex;
  flex-direction: column;
}
</style>
