<template>
  <div class="transaction-item-container card" @click="onTransactionItemClick">
    <div class="transaction-item-closed" v-if="!isOpen">
      <div class="transaction-item-first-row">
        <div>{{ transaction.description }}</div>
        <div>{{ transaction.quotas[this.$store.state.username] }}€</div>
      </div>
      <div class="transaction-item-second-row">
        <div>{{ computeDate }}</div>
        <div>{{ transaction.category }}</div>
        <div>{{ computeSharedQuotasString }}</div>
      </div>
    </div>
    <div class="transaction-item-open" v-if="isOpen">
      <div class="transaction-item-first-row">
        <div>{{ transaction.description }}</div>
        <div>{{ transaction.quotas[this.$store.state.username] }}€</div>
      </div>
      <h2>Author</h2>
      {{ transaction.author }}
      <div v-if="transaction.category">
        <h2>Category</h2>
        {{ transaction.category }}
      </div>
      <div class="quotas-section" v-if="Object.keys(transaction.quotas).length > 1">
        <h2>Other quotas</h2>
        <div v-for="(quota, key) in transaction.quotas" :key="key">
          <div v-if="key !== this.$store.state.username">
            {{ key }}: {{ transaction.quotas[key] }}€
          </div>
        </div>
      </div>
      <div class="buttons-section" v-if="canEdit">
        <button type="button" name="edit-transaction-button" @click.stop="onEditTransactionClick">
          Edit
        </button>
        <button
          type="button"
          name="delete-transaction-button"
          @click.stop="onDeleteTransactionClick"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { isOpen: false }
  },
  props: {
    transaction: Object
  },
  emits: ['editTransaction', 'deleteTransaction'],
  methods: {
    onTransactionItemClick() {
      this.isOpen = !this.isOpen
    },
    onEditTransactionClick() {
      this.$emit('editTransaction', this.transaction)
    },
    async onDeleteTransactionClick() {
      await this.$emit('deleteTransaction', this.transaction)
    }
  },
  computed: {
    computeSharedQuotasString() {
      let sentence = 'Not shared'
      const numOfPeopleInQuota = Object.keys(this.transaction.quotas).length
      if (numOfPeopleInQuota > 2) {
        sentence = `Shared with ${Object.keys(this.transaction.quotas).length - 1} people`
      } else {
        for (let user in this.transaction.quotas) {
          if (user !== this.$store.state.username) {
            sentence = `Shared with ${user}`
            break
          }
        }
      }
      return sentence
    },
    computeDate() {
      return `${this.transaction.year}-${String(this.transaction.month).padStart(2, '0')}-${String(this.transaction.day).padStart(2, '0')}`
    },
    canEdit() {
      return this.$store.state.username === this.transaction.author
    }
  }
}
</script>

<style scoped>
.transaction-item-first-row,
.transaction-item-second-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

.transaction-item-first-row {
  font-size: 1.2em;
  font-weight: bold;
}
.transaction-item-second-row {
  font-size: 1em;
  font-style: italic;
  color: rgba(0, 0, 0, 0.4);
}
.buttons-section {
  display: flex;
  flex-direction: column;
}
</style>
