<script>
import BalanceBarChart from './BalanceBarChart.vue'
import Spectrum from '@/utils/colors/Spectrum.js'

const prettifier = {
  myTotal(amount) {
    if (amount < 0) {
      return `Your balance is ${-amount}`
    } else {
      return `Your balance is ${-amount}`
    }
  },
  myExpenses(amount) {
    if (amount < 0) {
      return `You managed to receive ${-amount}`
    } else {
      return `Your expenses were ${amount}`
    }
  },
  prettySentence(amount, username, name, surname) {
    if (amount < 0) {
      return `${this.prettyNameString(username, name, surname)} owes you ${-amount}`
    } else if (amount > 0) {
      return `You owe ${this.prettyNameString(username, name, surname)} ${amount}`
    } else {
      return `You are even with ${this.prettyNameString(username, name, surname)}`
    }
  },
  prettyNameString(username, name, surname) {
    return `${name} ${surname} (${username})`
  }
}

export default {
  components: {
    BalanceBarChart
  },
  data() {
    return { balance: {}, cachedUsers: {}, balanceChartData: {}, dataReady: false }
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

      const results = await fetch(`/api/users/search?q=${username}`)
      if (results.ok) {
        const users = await results.json()
        for (let item in users) {
          if (users[item].username === username) return users[item]
        }
      } else {
        console.log(`Cannot GET users due to ${results}`)
      }
    },
    async getBalance() {
      const result = await fetch('/api/balance')
      if (result.ok) {
        this.balance = await result.json()
      } else {
        console.log(`Cannot GET balance due to ${result}`)
      }
    },
    async getBalanceAgainst(id) {
      const result = await fetch(`/api/balance/${id}`)
      if (result.ok) {
        this.balance = await result.json()
      } else {
        console.log(`Cannot GET balance due to ${result}`)
      }
    },
    composeChartData() {
      let labels = []
      let data = []
      let numOfEntries = 0
      for (let item in this.balance) {
        if (!item.startsWith('_')) {
          labels.push(item)
          data.push(this.balance[item])
          numOfEntries = numOfEntries + 1
        }
      }

      const spectrum = Spectrum.generate(numOfEntries)
      let transparentSpectrum = spectrum.withAlpha(0.4)

      const datasets = [
        {
          label: 'amount',
          borderWidth: 1,
          data: data,
          backgroundColor: transparentSpectrum.toRGBAStringArray(),
          borderColor: spectrum.toRGBAStringArray()
        }
      ]

      this.balanceChartData = {
        labels: labels,
        datasets: datasets
      }
    },
    async initBalance() {
      await this.getBalance()
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
      <BalanceBarChart :chartData="balanceChartData" />
    </div>
  </div>
</template>
