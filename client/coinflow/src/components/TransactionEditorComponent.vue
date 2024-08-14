<template>
  <div class="editor-wrapper">
    <h1>Description</h1>
    <input
      type="text"
      v-model="currentTransaction.description"
      value="currentTransaction.description"
    />
    <h1>Category</h1>
    <input type="text" v-model="currentTransaction.category" value="currentTransaction.category" />
    <h1>Date</h1>
    <div class="date-editor-wrapper">
      <input type="text" v-model="currentTransaction.year" value="currentTransaction.year" />
      <input type="text" v-model="currentTransaction.month" value="currentTransaction.month" />
      <input type="text" v-model="currentTransaction.day" value="currentTransaction.day" />
    </div>
    <h1>User Quotas</h1>
    <div class="add-user-quota-wrapper">
      <select v-model="selectedUsername">
        <option v-for="user in cachedUsers" :key="user.username">
          {{ user.username }}
        </option>
      </select>
      <button type="button" name="add-user-quota-button">Add user</button>
    </div>
    <div class="user-quotas-editor-wrapper">
      <div>Total cost: {{ totalCost }}</div>
      <div v-for="(quota, key) in currentTransaction.quotas" :key="quota">
        {{ key }}:
        <input
          type="text"
          v-model="currentTransaction.quotas[key]"
          value="currentTransaction.quotas[key]"
        />
      </div>
    </div>
    {{ currentTransaction }}
  </div>
</template>

<script>
import fetcher from '@/utils/fetch/fetcher.js'

export default {
  data() {
    return {
      currentTransaction: {},
      selectedUsername: '',
      cachedUsers: [],
      dataReady: false
    }
  },
  props: {
    transaction: Object
  },
  methods: {
    reset() {
      this.currentTransaction = {}
    },
    submit() {
      // TODO: parse transaction object and clean it if it contains spurious items
    }
  },
  computed: {
    totalCost() {
      if (!this.currentTransaction.quotas) return 0

      let totalCost = 0
      for (let quota in this.currentTransaction.quotas) {
        totalCost = totalCost + Number(this.currentTransaction.quotas[quota])
      }
      return totalCost
    }
  },
  watch: {
    transaction: function (newVal, curVal) {
      Object.assign(this.currentTransaction, newVal)
    }
  },
  async mounted() {
    this.cachedUsers = await fetcher.usersSearch('')
    console.log(this.cachedUsers)
    this.dataReady = true
  }
}
</script>

<style>
.editor-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 300px;
}
.date-editor-wrapper,
.add-user-quota-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: left;
}
input {
  font-size: 1.1em;
}
</style>
