<template>
  <div class="editor-wrapper">
    <input
      type="text"
      v-model="currentTransaction.description"
      value="currentTransaction.description"
    />
    <input type="text" v-model="currentTransaction.category" value="currentTransaction.category" />
    <div class="date-editor-wrapper">
      <input type="text" v-model="currentTransaction.year" value="currentTransaction.year" />
      <input type="text" v-model="currentTransaction.month" value="currentTransaction.month" />
      <input type="text" v-model="currentTransaction.day" value="currentTransaction.day" />
    </div>
    {{ currentTransaction }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentTransaction: {}
    }
  },
  props: {
    transaction: Object
  },
  methods: {
    reset() {
      this.currentTransaction = {}
    }
  },
  watch: {
    transaction: function (newVal, curVal) {
      Object.assign(this.currentTransaction, newVal)
    }
  }
}
</script>

<style>
.editor-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 300px;
}
.date-editor-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
