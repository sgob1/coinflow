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
        <UserItem
          :user="user"
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
import transactions from '@/utils/transactions.js'

let searchFilters = {
  user: (ts, value, self, other) =>
    ts.filter((tr) => {
      if (other === '_total' || other === undefined) {
        return true
      }

      if (other === undefined) {
        return false
      }

      if (tr.quotas[other] && (tr.author === self || tr.author === other)) return true
      return false
    }),
  year: (ts, value) => ts.filter((t) => Number(t.year) === Number(value)),
  month: (ts, value) => ts.filter((t) => Number(t.month) === Number(value))
}

const parseQuery = function (query) {
  let tokens = query
    .trim()
    .split(' ')
    .filter((s) => s.length > 0)

  let structuredQuery = {}
  let queryArray = []
  for (let token of tokens) {
    if (token.indexOf(':') > -1) {
      let keyVal = token.split(':')
      structuredQuery[keyVal[0]] = keyVal[1]
    } else {
      queryArray.push(token)
    }
  }
  structuredQuery.query = queryArray.join(' ')
  return structuredQuery
}

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
      let structuredQuery = parseQuery(query)

      this.transactionsSearchResults = []
      this.usersSearchResults = []

      let currentTransactions =
        structuredQuery.query === ''
          ? await fetcher.budget(structuredQuery['year'], structuredQuery['month'])
          : await fetcher.transactionsSearch(structuredQuery.query)

      for (let filter in searchFilters) {
        if (structuredQuery[filter] !== undefined) {
          currentTransactions = searchFilters[filter](
            currentTransactions,
            structuredQuery[filter],
            this.$store.state.username,
            structuredQuery['user']
          )
        }
      }

      this.transactionsSearchResults = currentTransactions

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
