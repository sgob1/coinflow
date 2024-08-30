<template>
  <div class="summary">
    <p>{{ totalAmountPretty }}</p>
    <button type="button" @click="onViewBalanceClick">Details</button>
  </div>
</template>

<script>
import prettifier from '@/utils/prettifier.js'

export default {
  props: {
    totalAmount: String,
    user: String
  },
  data() {
    return {}
  },
  computed: {
    totalAmountPretty() {
      if (this.user === '_total') {
        return prettifier.myTotal(Number(this.totalAmount), '€')
      } else {
        return prettifier.userSentence(this.totalAmount, '€', this.user)
      }
    }
  },
  methods: {
    onViewBalanceClick() {
      this.$router.replace({ name: 'balance' })
    }
  }
}
</script>

<style scoped>
.summary {
  margin: 20% 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 2em;
  font-weight: bold;
}
</style>
