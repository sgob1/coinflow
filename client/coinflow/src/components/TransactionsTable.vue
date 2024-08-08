<template>
  <div v-if="dataReady">
    <SummaryComponent :total-amount="balance['_total']" />
    <div id="table-menu" class="transactions-table-menu">
      <input placeholder="Year" v-model="year" @input="onOptionsChange" />
      <input placeholder="Month" v-model="month" @input="onOptionsChange" />
      <select name="users" id="users-dropdown">
        <option>All users</option>
        <option v-for="user in cachedUsers" :key="user.username">
          <div class="user-dropdown-item" @click="">
            {{ user.username }} ({{ user.name }} {{ user.surname }})
          </div>
        </option>
      </select>
      <button class="submit-button" @click="onOptionsChange">Submit</button>
    </div>
    <div id="main-table" class="transactions-table" v-if="validOptions">
      <li v-for="transaction in transactions" :key="transaction.transactionId">
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
      timeScope: 'monthly',
      yearInput: new Date().getFullYear(),
      monthInput: new Date().getMonth(),
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      user: {},
      transactions: [],
      balance: {},
      cachedUsers: {},
      validOptions: false,
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
      if (!this.validYear(this.year)) {
        this.validOptions = false
      } else if (!this.validMonth(this.month)) {
        this.validOptions = false
      } else {
        this.validOptions = true
        this.getBudget()
      }
    },
    validYear(year) {
      if (isNaN(year) || year === '' || year < 1970) return false
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
    getCachedUserByUsername(username) {
      return this.cachedUsers[username]
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
    },
    async findUserByUsername(username) {
      if (this.cachedUsers[username]) return this.cachedUsers[username]
      const user = await fetcher.usersSearch(username)
      this.cachedUsers[username] = user
      return user
    },
    async getBudget() {
      switch (this.timeScope) {
        case 'yearly':
          this.yearlyBudget()
          break
        case 'alltime':
          this.alltimeBudget()
          break
        default:
          this.monthlyBudget()
          break
      }
    },
    async getBalance() {
      this.balance = await fetcher.balance()
    }
  },
  async mounted() {
    await this.getBalance()
    await this.cacheUsersInBalance()
    this.onOptionsChange()
    this.dataReady = true
  }
}
</script>

<style>
.table-menu {
  display: flex;
  flex-direction: row;
}
</style>
