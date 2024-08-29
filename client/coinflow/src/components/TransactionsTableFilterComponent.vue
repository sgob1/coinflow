<template>
  <div id="table-menu" class="transactions-table-menu">
    <input
      type="number"
      min="1900"
      max="2100"
      placeholder="Year"
      value="currentYear"
      v-model="year"
      @input="onFiltersChange"
    />
    <input
      type="number"
      min="1"
      max="12"
      placeholder="Month"
      value="currentMonth"
      v-model="month"
      @input="onFiltersChange"
    />
    <select v-model="selectedUsername" @change="onFiltersChange">
      <option value="_total">Total balance</option>
      <option v-for="user in users" :key="user.username">
        {{ user.username }}
      </option>
    </select>
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
      let filters = {
        year: this.year,
        month: this.month,
        username: this.selectedUsername
      }
      console.log(filters)
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
}
</style>
