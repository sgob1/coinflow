<script>
export default {
  data() {
    return {}
  },
  props: {
    transaction: Object
  },
  methods: {
    // TODO
  },
  computed: {
    computeSharedQuotasString() {
      let sentence = ''
      switch (this.transaction.quotas.length) {
        case 0:
          sentence = 'Not shared'
          break
        case 1: {
          for (let user in this.transaction.quotas) {
            if (user !== this.transaction.author) {
              sentence = `Shared with ${user}`
              break
            }
          }
          break
        }
        default:
          if (this.transaction.quotas)
            sentence = `Shared with ${Object.keys(this.transaction.quotas).length - 1} people`
          else sentence = `Not shared`
      }
      return sentence
    },
    computeDate() {
      return `${this.transaction.year}-${String(this.transaction.month).padStart(2, '0')}-${String(this.transaction.day).padStart(2, '0')}`
    }
  }
}
</script>

<template>
  <!-- Use like this -->
  <!-- <TransactionItem :transaction="testTransaction" /> -->
  <tr>
    <td>{{ computeDate }}</td>
    <td>{{ transaction.author }}</td>
    <td>{{ transaction.category }}</td>
    <td>{{ transaction.description }}</td>
    <td>{{ computeSharedQuotasString }}</td>
  </tr>
</template>

<style scoped>
/* TODO */
</style>
