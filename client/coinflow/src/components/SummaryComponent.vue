<template>
  <div class="summary" id="summary">
    <p>{{ totalAmountPretty }}</p>
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
  }
}
</script>

<style scoped>
.summary {
  margin: 20% 10%;
  display: flex;
  justify-content: center;
  font-size: 2em;
  font-weight: bold;
}
</style>
