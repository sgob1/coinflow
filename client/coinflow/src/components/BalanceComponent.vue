<script>
// import DoughnutChart from '@/components/DoughnutCategoryChartComponent.vue'
import Spectrum from '@/utils/colors/Spectrum.js'
import fetcher from '@/utils/fetch/fetcher.js'
import prettifier from '@/utils/prettifier.js'

export default {
  components: {
    // DoughnutChart
  },
  data() {
    return { balance: {}, cachedUsers: {}, categoryChartData: {}, budget: {}, dataReady: false }
  },
  computed: {
    generatePrettyBalance() {
      const owner = this.$store.state.username

      let prettyBalance = []
      const totalAmount = this.balance['_total']
      prettyBalance.push(prettifier.myTotal(totalAmount))

      const myExpenses = this.balance[owner]
      prettyBalance.push(prettifier.myExpenses(myExpenses))

      for (let item in this.balance) {
        if (!item.startsWith('_') && item !== owner) {
          const amount = this.balance[item]
          const user = this.getCachedUserByUsername(item)
          prettyBalance.push(
            prettifier.prettySentence(amount, user.username, user.name, user.surname)
          )
        }
      }
      return prettyBalance
    },
    balanceByCategory() {
      let categoriesBalance = {}
      for (let transaction of this.budget) {
        if (transaction.quotas[this.$store.state.username] > 0.0) {
          if (!categoriesBalance[transaction.category])
            categoriesBalance[transaction.category] = 0.0
          categoriesBalance[transaction.category] += transaction.quotas[this.$store.state.username]
        }
      }
      return categoriesBalance
    }
  },
  methods: {
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
      const user = fetcher.usersSearch(username)
      this.cachedUsers[username] = user
      return user
    },
    async getBalance() {
      this.balance = await fetcher.balance()
    },
    async getBudget() {
      this.budget = await fetcher.budget()
    },
    composeChartData() {
      let labels = []
      let data = []
      let numOfEntries = 0
      for (let item in this.balanceByCategory) {
        labels.push(item)
        data.push(this.balanceByCategory[item])
        numOfEntries = numOfEntries + 1
      }

      const spectrum = Spectrum.generateVivid(numOfEntries).withAlpha(0.6)

      const datasets = [
        {
          borderWidth: 2,
          data: data,
          backgroundColor: spectrum.toRGBAStringArray()
        }
      ]

      this.categoryChartData = {
        labels: labels,
        datasets: datasets
      }
    },
    async initBalance() {
      await this.getBalance()
      await this.getBudget()
      await this.cacheUsersInBalance()
      this.composeChartData()
    }
  },
  async mounted() {
    await this.initBalance()
    this.dataReady = true
  }
}
</script>

<template>
  <div class="balance" id="balance">
    <div v-if="dataReady">
      <li v-for="item in generatePrettyBalance" :key="item">{{ item }}</li>
      <div class="container">
        <h2>Expenses by category</h2>
        <!-- <DoughnutChart :chartData="categoryChartData" /> -->
      </div>
    </div>
  </div>
</template>
