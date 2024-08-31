<template>
  <button type="button" @click="onAddTransactionClick" v-if="!isOpen">Create new</button>
  <div class="card" v-if="isOpen">
    <TransactionEditorComponent
      class="bottom-sheet-component"
      @transaction-submitted="onTransactionSubmitted"
      @cancel="onEditorCancel"
    />
  </div>
</template>

<script>
import TransactionEditorComponent from '@/components/TransactionEditorComponent.vue'

export default {
  components: {
    TransactionEditorComponent
  },
  data() {
    return {
      isOpen: false,
      transaction: {}
    }
  },
  methods: {
    onAddTransactionClick() {
      this.isOpen = true
    },
    onEditorCancel() {
      this.isOpen = false
    },
    onTransactionSubmitted() {
      this.isOpen = false
      this.$emit('transactionCreated')
    }
  }
}
</script>
