<template>
  <div>
    <AddTransactionComponent @transaction-created="$emit('transactionModified')" />
    <div id="transactions-table">
      <li v-for="(item, key) in listOfItems" :key="key">
        <UserItem
          v-if="item.id !== undefined"
          :user="item"
          @see-user-transactions-click="
            (username) => this.$emit('seeUserTransactionsClick', username)
          "
        />
        <TransactionItem
          v-if="item.transactionId !== undefined"
          :transaction="item"
          @delete-transaction="onDeleteTransaction"
          @see-user-transactions-click="
            (username) => this.$emit('seeUserTransactionsClick', username)
          "
          @see-category-click="(category) => this.$emit('seeCategoryClick', category)"
          @transaction-modified="$emit('transactionModified')"
        />
      </li>
    </div>
    <div class="page-selector" v-if="!searchModeOn">
      <button type="button" @click="onPreviousClick" v-if="canGoToPreviousPage">Previous</button>
      <div class="medium bold">{{ currentPage }}</div>
      <button type="button" @click="onNextClick" v-if="canGoToNextPage">Next</button>
    </div>
  </div>
</template>

<script>
import TransactionItem from '@/components/TransactionItem.vue'
import AddTransactionComponent from '@/components/AddTransactionComponent.vue'
import UserItem from '@/components/UserItem.vue'

import fetcher from '@/utils/fetch/fetcher.js'
import searchUtils from '@/utils/search/searchUtils.js'

export default {
  emits: ['editTransaction', 'deleteTransaction'],
  components: {
    TransactionItem,
    UserItem,
    AddTransactionComponent
  },
  props: {
    query: String
  },
  data() {
    return {
      transactionsSearchResults: [],
      usersSearchResults: [],
      currentPage: 0,
      transactionsPerPage: 10
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
    },
    onPreviousClick() {
      if (this.canGoToPreviousPage) {
        this.currentPage = this.currentPage - 1
      }
    },
    onNextClick() {
      if (this.canGoToNextPage) {
        this.currentPage = this.currentPage + 1
      }
    },
    currentPageTransactions() {
      if (this.transactionsSearchResults !== undefined) {
        let startIndex = this.transactionsPerPage * this.currentPage
        let endIndex = this.transactionsPerPage * (this.currentPage + 1)
        return this.transactionsSearchResults.slice(startIndex, endIndex)
      } else {
        return []
      }
    }
  },
  computed: {
    listOfItems() {
      let users = this.usersSearchResults ? this.usersSearchResults : []
      let transactions = this.transactionsSearchResults ? this.transactionsSearchResults : []
      if (this.searchModeOn) {
        return Array.prototype.concat(users, transactions)
      } else {
        return Array.prototype.concat(users, this.currentPageTransactions())
      }
    },
    canGoToNextPage() {
      return this.currentPage < this.maxPageNumber - 1
    },
    canGoToPreviousPage() {
      return this.currentPage > 0
    },
    maxPageNumber() {
      if (this.transactionsSearchResults !== undefined)
        return Math.ceil(this.transactionsSearchResults.length / this.transactionsPerPage)
      else return 1
    },
    searchModeOn() {
      return this.query.length > 0
    }
  },
  watch: {
    query: async function (newVal, oldVal) {
      await this.refresh()
    },
    transactionsSearchResults: async function (newVal, oldVal) {
      this.currentPage = 0
    }
  },
  async mounted() {
    await this.refresh()
  }
}
</script>

<style>
.page-selector {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  align-items: center;
  gap: 4px;
}
</style>
