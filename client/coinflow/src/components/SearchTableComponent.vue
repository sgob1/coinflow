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
import transactions from '@/utils/transactions.js'

export default {
  emits: ['editTransaction', 'deleteTransaction'],
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
    async processQuery(query) {
      let trimmed = query.trim()
      if (trimmed.startsWith('user:')) {
        let username = trimmed.substring(5)
        this.transactionsSearchResults = []
        let allTransactions = await fetcher.budget()
        this.transactionsSearchResults = transactions.mutualTransactions(
          allTransactions,
          this.$store.state.username,
          username
        )
      } else {
        await this.searchTransactions(trimmed)
        await this.searchUsers(trimmed)
      }
    },
    async searchTransactions(query) {
      this.transactionsSearchResults = []
      this.transactionsSearchResults = await fetcher.transactionsSearch(query)
    },
    async searchUsers(query) {
      this.usersSearchResults = []
      this.usersSearchResults = await fetcher.usersSearch(query)
    },
    async refresh() {
      await this.processQuery(this.query)
      // await this.searchTransactions(this.query)
      // await this.searchUsers(this.query)
    },
    onEditTransaction(transaction) {
      this.$emit('editTransaction', transaction)
    },
    onDeleteTransaction(transaction) {
      this.$emit('deleteTransaction', transaction)
    }
  },
  watch: {
    query: async function (newVal, oldVal) {
      await this.refresh()
      // await this.searchTransactions(newVal)
      // await this.searchUsers(newVal)
    }
  },
  async mounted() {
    await this.refresh()
  }
}
</script>
