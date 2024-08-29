<template>
  <div id="main-table" class="transactions-table">
    <li v-for="transaction in transactionsList" :key="transaction.transactionId">
      <TransactionItem
        :transaction="transaction"
        @edit-transaction="onEditTransaction"
        @delete-transaction="onDeleteTransaction"
      />
    </li>
  </div>
</template>

<script>
import TransactionItem from '@/components/TransactionItem.vue'

export default {
  components: {
    TransactionItem
  },
  props: {
    transactions: Object
  },
  data() {
    return {}
  },
  computed: {
    transactionsList() {
      return this.transactions
    }
  },
  methods: {
    onEditTransaction(transaction) {
      this.$emit('editTransaction', transaction)
    },
    onDeleteTransaction(transaction) {
      this.$emit('deleteTransaction', transaction)
    }
  }
}
</script>
