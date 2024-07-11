<template>
  <div class="balance" id="balance">
    {{ balance }}
  </div>
</template>

<script>
export default {
  data() {
    return { balance: {} }
  },
  methods: {
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
    }
  },
  async mounted() {
    await this.getBalance()
  }
}
</script>
