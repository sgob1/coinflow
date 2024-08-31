<template>
  <div id="table-menu" class="transactions-table-menu">
    <input
      class="filter-item"
      type="number"
      min="1900"
      max="2100"
      placeholder="Year"
      value="currentYear"
      v-model="year"
    />
    <input
      class="filter-item"
      type="number"
      min="1"
      max="12"
      placeholder="Month"
      value="currentMonth"
      v-model="month"
    />
    <select v-model="selectedUsername" class="filter-item">
      <option value="_total">Total balance</option>
      <option v-for="user in users" :key="user.username">
        {{ user.username }}
      </option>
    </select>
    <button type="button" class="filter-item" @click="onFiltersChange">Filter</button>
  </div>
</template>

<script>
export default {
  emits: ['filtersChanged'],
  data() {
    return {
      selectedUsername: '_total',
      year: '',
      month: ''
    }
  },
  props: {
    users: Object
  },
  methods: {
    onFiltersChange() {
      let filters = {}
      if (this.year !== '') filters.year = this.year
      if (this.month !== '') filters.month = this.month
      if (
        this.selectedUsername !== '_total' &&
        this.selectedUsername !== '' &&
        this.selectedUsername !== undefined
      )
        filters.user = this.selectedUsername

      this.selectedUsername = '_total'
      this.year = ''
      this.month = ''

      this.$emit('filtersChanged', filters)
    }
  },
  mounted() {
    this.onFiltersChange()
  }
}
</script>

<style>
.table-menu {
  display: flex;
  flex-direction: row;
  gap: 8px;
}
input {
  min-width: 100px;
}
.filter-item {
  margin: 4px;
}
</style>
