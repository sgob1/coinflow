<template>
  <div id="headerbar">
    <img
      src="@/assets/app-icon.png"
      alt="Coinflow logo"
      class="icon"
      @click="onCoinflowLogoClick"
    />
    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="Search..." />
      <img
        src="@/assets/close.png"
        alt="Back"
        class="icon-small"
        @click="onClearClick"
        v-if="searchQuery.length > 0"
      />
    </div>
    <img src="@/assets/user.png" alt="Account" class="icon" />
  </div>
</template>

<script>
export default {
  data() {
    return { searchQuery: '' }
  },
  methods: {
    onClearClick() {
      this.searchQuery = ''
    },
    onCoinflowLogoClick() {
      window.location.reload()
    },
    setQuery(value) {
      this.searchQuery = value
    },
    getQuery() {
      return this.searchQuery
    }
  },
  watch: {
    searchQuery: function (newVal, oldVal) {
      this.$store.commit('setSearchQuery', newVal)
    }
  }
}
</script>

<style scoped>
.icon {
  height: 50px;
  width: 50px;
}

.icon-small {
  height: 25px;
  width: 25px;
  margin: auto 8px;
  padding: 2px;
}

#headerbar {
  background-color: #ffffff;
  border: 1px solid #cccccc;
  padding: 8px;
  margin: 0px;
  display: flex;
  justify-content: space-between;
}

input {
  min-height: 40px;
  border-radius: 10px;
  padding: 8px;
}

.search-bar {
  padding: 8px;
  margin: 0px;
  display: flex;
  justify-content: space-between;
}
</style>
