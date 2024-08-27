<template>
  <div id="search-view">
    {{ transactionsList }}
    {{ usersList }}
    <div v-for="(transaction, key) in transactionsList">
      <TransactionItem
        :transaction="transaction"
        @edit-transaction="onEditTransaction"
        @delete-transaction="onDeleteTransaction"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import fetcher from '@/utils/fetch/fetcher.js'
import TransactionItem from '@/components/TransactionItem.vue'

export default {
  components: {
    TransactionItem
  },
  data() {
    return {
      transactionsList: [],
      usersList: []
    }
  },
  computed: mapState(['searchQuery']),
  methods: {
    async searchTransactions(query) {
      this.transactionsList = []
      this.transactionsList = await fetcher.transactionsSearch(query)
    },
    async searchUsers(query) {
      this.usersList = []
      this.usersList = await fetcher.usersSearch(query)
    }
  },
  watch: {
    searchQuery: async function (newVal, oldVal) {
      await this.searchTransactions(newVal)
      await this.searchUsers(newVal)
    }
  }
}
</script>

<style>
#search-view {
  background-color: #ffffff;
  border: 1px solid #cccccc;
  padding: 8px;
  margin: 0px;
  max-width: 100%;
}
</style>
