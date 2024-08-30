<template>
  <div>
    <div id="search-table">
      <li v-for="user in usersSearchResults" :key="user.userId">
        <UserItem
          :user="user"
          @see-user-transactions-click="
            (username) => this.$emit('seeUserTransactionsClick', username)
          "
        />
      </li>
      <li v-for="transaction in transactionsSearchResults" :key="transaction.transactionId">
        <TransactionItem
          :transaction="transaction"
          @edit-transaction="onEditTransaction"
          @delete-transaction="onDeleteTransaction"
          @see-user-transactions-click="
            (username) => this.$emit('seeUserTransactionsClick', username)
          "
        />
      </li>
    </div>
  </div>
</template>

<script>
import TransactionItem from '@/components/TransactionItem.vue'
import UserItem from '@/components/UserItem.vue'

import fetcher from '@/utils/fetch/fetcher.js'
import searchUtils from '@/utils/search/searchUtils.js'

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
      let structuredQuery = searchUtils.parseQuery(query)

      this.transactionsSearchResults = []
      this.usersSearchResults = []

      let currentTransactions =
        structuredQuery.query === ''
          ? await fetcher.budget(structuredQuery['year'], structuredQuery['month'])
          : await fetcher.transactionsSearch(structuredQuery.query)

      this.transactionsSearchResults = searchUtils.applyFilters(
        currentTransactions,
        searchUtils.searchFilters,
        structuredQuery
      )

      if (!structuredQuery['user'] && structuredQuery.query !== '')
        await this.searchUsers(structuredQuery.query)
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
    }
  },
  async mounted() {
    await this.refresh()
  }
}
</script>
