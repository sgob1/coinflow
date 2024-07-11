<script>
import TransactionItem from './TransactionItem.vue'

export default {
  components: {
    TransactionItem
  },
  data() {
    return {
      transactions: []
    }
  },
  computed: {
    year() {
      return new Date().getFullYear()
    },
    month() {
      return new Date().getMonth()
    }
  },
  methods: {
    async thisMonthBudget() {
      const response = await fetch(`/api/budget/${this.year}/${this.month}`)
      if (response.ok) {
        this.transactions = await response.json()
      } else {
        console.log(`Invalid response: ${response}`)
      }
      return response
    },
    async thisYearBudget() {
      const response = await fetch(`/api/budget/${this.year}`)
      if (response.ok) {
        this.transactions = await response.json()
      } else {
        console.log(`Invalid response: ${response}`)
      }
      return response
    }
  },
  async mounted() {
    await this.thisMonthBudget()
  }
}
</script>

<template>
  <div id="main-table" class="transactions-table">
    <li v-for="transaction in transactions">
      <TransactionItem :transaction="transaction" />
    </li>
  </div>
</template>
