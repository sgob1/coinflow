<template>
  <div id="main-view">
    <BalanceComponent />

    <TransactionsTable />
  </div>
</template>

<script>
import TransactionsTable from '@/components/TransactionsTable.vue'
import BalanceComponent from '@/components/BalanceComponent.vue'

export default {
  name: 'MainView',
  components: {
    TransactionsTable,
    BalanceComponent
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
