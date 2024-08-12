<template>
  <div class="transaction-item-container card">
    <div class="transaction-item-first-row">
      <div>{{ transaction.description }}</div>
      <div>{{ transaction.quotas[this.$store.state.username] }}€</div>
    </div>
    <div class="transaction-item-second-row">
      <div>{{ computeDate }}</div>
      <div>{{ transaction.category }}</div>
      <div>{{ computeSharedQuotasString }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    transaction: Object
  },
  methods: {},
  computed: {
    computeSharedQuotasString() {
      let sentence = 'Not shared'
      const numOfPeopleInQuota = Object.keys(this.transaction.quotas).length
      if (numOfPeopleInQuota > 2) {
        sentence = `Shared with ${Object.keys(this.transaction.quotas).length - 1} people`
      } else {
        for (let user in this.transaction.quotas) {
          if (user !== this.$store.state.username) {
            sentence = `Shared with ${user}`
            break
          }
        }
      }
      return sentence
    },
    computeDate() {
      return `${this.transaction.year}-${String(this.transaction.month).padStart(2, '0')}-${String(this.transaction.day).padStart(2, '0')}`
    }
  }
}
</script>

<style scoped>
.transaction-item-first-row,
.transaction-item-second-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

.transaction-item-first-row {
  font-size: 1.2em;
  font-weight: bold;
}
.transaction-item-second-row {
  font-size: 1em;
  font-style: italic;
  color: rgba(0, 0, 0, 0.4);
}
</style>
