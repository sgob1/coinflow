<template>
  <div>
    <div id="search-table">
      <li v-for="transaction in transactionsSearchResults" :key="transaction.transactionId">
        <TransactionItem
          :transaction="transaction"
          @edit-transaction="onEditTransaction"
          @delete-transaction="onDeleteTransaction"
        />
      </li>
      <li v-for="user in usersSearchResults" :key="user.userId">
        <UserItem :user="user" />
      </li>
    </div>
  </div>
</template>

<script>
import TransactionItem from '@/components/TransactionItem.vue'
import UserItem from '@/components/UserItem.vue'

import fetcher from '@/utils/fetch/fetcher.js'

export default {
  components: {
    TransactionItem,
    UserItem
  },
  props: {
    query: String
  },
  data() {
    return {
      transactionsSearchResults: [],
      usersSearchResults: []
    }
  },
  methods: {
    async searchTransactions(query) {
      this.transactionsSearchResults = []
      this.transactionsSearchResults = await fetcher.transactionsSearch(query)
    },
    async searchUsers(query) {
      this.usersSearchResults = []
      this.usersSearchResults = await fetcher.usersSearch(query)
    },
    async refreshSearch() {
      await this.searchTransactions(this.searchQuery)
      await this.searchUsers(this.searchQuery)
    }
  },
  watch: {
    query: async function (newVal, oldVal) {
      await this.searchTransactions(newVal)
      await this.searchUsers(newVal)
    }
  }
}
</script>
