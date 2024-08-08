<template>
  <div v-if="dataReady">
    <SummaryComponent
      :total-amount="balance[this.selectedUsername]"
      :user="this.selectedUsername"
    />
    <div id="table-menu" class="transactions-table-menu">
      <input placeholder="Year" v-model="year" @input="onOptionsChange" />
      <input placeholder="Month" v-model="month" @input="onOptionsChange" />
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
        <TransactionItem :transaction="transaction" />
      </li>
    </div>
  </div>
</template>

<script>
import SummaryComponent from '@/components/SummaryComponent.vue'
import TransactionItem from './TransactionItem.vue'
import fetcher from '@/utils/fetch/fetcher.js'

export default {
  components: {
    SummaryComponent,
    TransactionItem
  },
  data() {
    return {
      year: '',
      month: '',
      selectedUsername: '_total',
      transactions: [],
      balance: {},
      cachedUsers: {},
      dataReady: false
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
    onOptionsChange() {
      this.dataReady = false
      this.getBudget()
      this.dataReady = true
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
        if (transaction.quotas[username]) filteredTransactions.push(transaction)
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
.table-menu {
  display: flex;
  flex-direction: row;
}
</style>
