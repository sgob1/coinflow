<template>
  <h2>Balance</h2>
  <div>{{ totalAmountPretty }}</div>
  <div>{{ myExpensesPretty }}</div>
  <div v-for="(userAmount, username) in remainingUsers" :key="username">
    {{ userAmountPretty(userAmount, username) }}
  </div>
  <div class="balance-details">
    <div class="details-row">
      <p>Your</p>
      <select v-model="selectedPeriod" @change="onSelectedPeriodChange">
        <option value="alltime">all-time</option>
        <option value="yearly">yearly</option>
        <option value="monthly">monthly</option>
      </select>
      <p>details</p>
    </div>
    <h2>Categories</h2>
    <div v-for="(amount, category) in categories" :key="category">
      {{ category }}: {{ roundAmount(amount) }}€
    </div>
    <div v-if="dataReady">
      <DoughnutChart
        :chartData="expensesChartData"
        :chartID="'expensesChart'"
        :title="'Expenses chart'"
      />
      <DoughnutChart
        :chartData="incomesChartData"
        :chartID="'incomesChart'"
        :title="'Incomes chart'"
      />
    </div>
  </div>
</template>

<script>
import fetcher from '@/utils/fetch/fetcher.js'
import prettifier from '@/utils/prettifier.js'
import transactions from '@/utils/transactions.js'
import DoughnutChart from '@/components/CategoryChartComponent.vue'
import Spectrum from '@/utils/colors/Spectrum.js'

export default {
  components: {
    DoughnutChart
  },
  data() {
    return {
      balance: {},
      budget: {},
      year: undefined,
      month: undefined,
      selectedPeriod: 'alltime',
      dataReady: false
    }
  },
  computed: {
    categories() {
      let categories = {}
      for (let item in this.budget) {
        let transactionCategory = this.budget[item].category
        let thisUserQuota = this.budget[item].quotas[this.$store.state.username]
        if (!categories[transactionCategory]) {
          categories[transactionCategory] = 0.0
        }
        categories[transactionCategory] =
          Number(categories[transactionCategory]) + Number(thisUserQuota)
      }
      return categories
    },
    currentYear() {
      return new Date().getFullYear()
    },
    currentMonth() {
      return new Date().getMonth() + 1
    },
    totalAmountPretty() {
      return prettifier.myTotal(Number(this.balance['_total']), '€')
    },
    myExpensesPretty() {
      return prettifier.myExpenses(Number(this.balance[this.$store.state.username]), '€')
    },
    remainingUsers() {
      let remainingUsers = {}
      for (let user in this.balance) {
        if (user !== '_total' && user !== this.$store.state.username) {
          remainingUsers[user] = this.balance[user]
        }
      }
      return remainingUsers
    },
    expensesChartData() {
      let labels = []
      let data = []
      let numOfEntries = 0
      for (let item in this.categories) {
        if (Number(this.categories[item]) > 0.0) {
          labels.push(item)
          data.push(Number(this.categories[item]))
          numOfEntries = numOfEntries + 1
        }
      }

      const spectrum = Spectrum.generateVivid(numOfEntries).withAlpha(0.4)

      const datasets = [
        {
          borderWidth: 2,
          data: data,
          backgroundColor: spectrum.toRGBAStringArray()
        }
      ]

      return {
        labels: labels,
        datasets: datasets
      }
    },
    incomesChartData() {
      let labels = []
      let data = []
      let numOfEntries = 0
      for (let item in this.categories) {
        if (Number(this.categories[item]) < 0.0) {
          labels.push(item)
          data.push(-Number(this.categories[item]))
          numOfEntries = numOfEntries + 1
        }
      }

      const spectrum = Spectrum.generateVivid(numOfEntries).withAlpha(0.6)

      const datasets = [
        {
          borderWidth: 2,
          data: data,
          backgroundColor: spectrum.toRGBAStringArray()
        }
      ]

      return {
        labels: labels,
        datasets: datasets
      }
    }
  },
  methods: {
    roundAmount(amount) {
      return transactions.roundAmount(amount)
    },
    userAmountPretty(userAmount, username) {
      return prettifier.userSentence(userAmount, '€', username)
    },
    async onSelectedPeriodChange() {
      this.dataReady = false
      this.budget = {}
      if (this.selectedPeriod === 'yearly') {
        this.budget = await fetcher.budget(this.currentYear)
      } else if (this.selectedPeriod === 'monthly') {
        this.budget = await fetcher.budget(this.currentYear, this.currentMonth)
      } else if (this.selectedPeriod === 'alltime') {
        this.budget = await fetcher.budget()
      } else {
        this.budget = {}
      }
      this.dataReady = true
    }
  },
  async mounted() {
    this.balance = await fetcher.balance()
    this.budget = await fetcher.budget()
    this.dataReady = true
  }
}
</script>

<style>
.details-row {
  display: flex;
  flex-direction: row;
  justify-content: start;
}

.details-row * {
  margin: 4px;
}
</style>
