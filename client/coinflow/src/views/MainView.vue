<template>
  <div id="main-view">
    <TransactionsTable />
  </div>
</template>

<script>
import TransactionsTable from '@/components/TransactionsTable.vue'

export default {
  name: 'MainView',
  components: {
    TransactionsTable
  },
  data() {
    return {}
  }
}
</script>

<style scoped>
#main-view {
  background-color: #ffffff;
  border: 1px solid #cccccc;
  padding: 8px;
  margin: 0px;
  max-width: 100%;
}
</style>
