<template>
  <div id="main-view" class="container">
    <h1>Main View</h1>
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
  padding: 20px;
  margin: auto;
  margin-top: 80px;
  width: 800px;
}
</style>
