<template>
  <div class="summary" id="summary">
    <p>Your balance is {{ totalAmount }}€</p>
  </div>
</template>

<script>
export default {
  props: {
    totalAmount: String
  },
  data() {
    return {}
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
