<template>
  <div id="main-view" class="container">
    <h1>Main View</h1>
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
  padding: 20px;
  margin: auto;
  margin-top: 80px;
  width: 800px;
}
</style>
