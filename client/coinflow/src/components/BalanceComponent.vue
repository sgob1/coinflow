<template>
  <div id="balance-container">
    <div class="card">
      <h2>Balance</h2>
      <div>{{ totalAmountPretty }}</div>
      <div>{{ myExpensesPretty }}</div>
      <div>{{ myIncomeThisMonth }}</div>
      <div>{{ myExpensesThisMonth }}</div>
      <div>{{ myBalanceThisMonth }}</div>
      <div v-for="(userAmount, username) in remainingUsers" :key="username">
        {{ userAmountPretty(userAmount, username) }}
      </div>
    </div>
    <div class="card">
      <div class="details-row">
        <h3>Your</h3>
        <select v-model="selectedPeriod" @change="onSelectedPeriodChange">
          <option value="alltime">all-time</option>
          <option value="yearly">yearly</option>
          <option value="monthly">monthly</option>
        </select>
        <h3>details</h3>
      </div>
      <h2>Categories</h2>
      <div v-for="(amount, category) in categories" :key="category">
        {{ category }}: {{ roundAmount(amount) }}€
      </div>
    </div>
    <div class="card" v-if="dataReady && Object.keys(expensesChartData.labels).length > 0">
      <DoughnutChart
        :chartData="expensesChartData"
        :chartID="'expensesChart'"
        :title="'Expenses chart'"
      />
    </div>
    <div class="card" v-if="dataReady && Object.keys(incomesChartData.labels).length > 0">
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
    monthlyExpenses() {
      let expenses = 0.0
      for (let item in this.budget) {
        if (
          this.budget[item].year === this.currentYear &&
          this.budget[item].month === this.currentMonth
        ) {
          let transactionAmount = Number(this.budget[item].quotas[this.$store.state.username])
          if (transactionAmount > 0.0) expenses = expenses + transactionAmount
        }
      }
      return transactions.roundAmount(expenses)
    },
    monthlyIncome() {
      let income = 0.0
      for (let item in this.budget) {
        if (
          this.budget[item].year === this.currentYear &&
          this.budget[item].month === this.currentMonth
        ) {
          let transactionAmount = Number(this.budget[item].quotas[this.$store.state.username])
          if (transactionAmount < 0.0) income = income + -transactionAmount
        }
      }
      return transactions.roundAmount(income)
    },
    monthlyBalance() {
      return transactions.roundAmount(Number(this.monthlyIncome) - Number(this.monthlyExpenses))
    },
    currentYear() {
      return new Date().getFullYear()
    },
    currentMonth() {
      return new Date().getMonth() + 1
    },
    totalAmountPretty() {
      return prettifier.myTotal(this.balance['_total'], '€')
    },
    myExpensesPretty() {
      if (this.balance[this.$store.state.username]) {
        return prettifier.myExpenses(this.balance[this.$store.state.username], '€')
      } else {
        return prettifier.myExpenses(0.0, '€')
      }
    },
    myExpensesThisMonth() {
      return prettifier.myExpensesThisMonth(Number(this.monthlyExpenses), '€')
    },
    myIncomeThisMonth() {
      return prettifier.myIncomeThisMonth(Number(this.monthlyIncome), '€')
    },
    myBalanceThisMonth() {
      return prettifier.myBalanceThisMonth(Number(this.monthlyBalance), '€')
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
  align-items: center;
}

.details-row * {
  margin: 4px;
}
</style>
