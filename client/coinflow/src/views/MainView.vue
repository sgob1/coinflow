<template>
  <div id="main-view" class="container">
    <h1>Dashboard</h1>
    <h2>Current balance</h2>
    <BalanceComponent />

    <h2>History</h2>
    <TransactionsTable />

    <h2>Other section</h2>
    <LoremComponent />
  </div>
</template>

<script>
import TransactionsTable from '@/components/TransactionsTable.vue'
import BalanceComponent from '@/components/BalanceComponent.vue'
import LoremComponent from '@/components/LoremComponent.vue'

export default {
  name: 'MainView',
  components: {
    TransactionsTable,
    BalanceComponent,
    LoremComponent
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
  padding: 20px;
  margin: auto;
  margin-top: 80px;
  width: 800px;
}
</style>
