<template>
  <div id="headerbar">
    <img
      src="@/assets/magnifying-glass.png"
      alt="Search"
      class="icon"
      @click="onSearchIconClick"
      v-if="!searchOpen"
    />
    <img
      src="@/assets/close.png"
      alt="Back"
      class="icon"
      @click="onGoBackClick"
      v-if="searchOpen"
    />
    <input type="text" v-model="searchQuery" placeholder="Search" v-if="searchOpen" />
    <img src="@/assets/user.png" alt="Account" class="icon" />
  </div>
</template>

<script>
export default {
  data() {
    return { searchQuery: '', searchOpen: false }
  },
  methods: {
    onSearchIconClick() {
      this.searchOpen = true
      this.$emit('openSearch')
    },
    onGoBackClick() {
      this.searchQuery = ''
      this.searchOpen = false
      this.$emit('closeSearch')
    },
    setQuery(value) {
      if (!this.searchOpen && value !== '' && value !== undefined) {
        this.onSearchIconClick()
      }
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

#headerbar {
  position: fixed;
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  padding: 8px;
  margin: 0px;
  display: flex;
  justify-content: space-between;
}
</style>
