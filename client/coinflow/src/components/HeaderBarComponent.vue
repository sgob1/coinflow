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
      src="@/assets/go-back.png"
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
      this.$router.replace({ name: 'search' })
      this.searchOpen = true
    },
    onGoBackClick() {
      this.$router.replace({ name: 'main' })
      this.$store.commit('setSearchQuery', '')
      this.searchOpen = false
    }
  },
  watch: {
    searchQuery: function (newVal, oldVal) {
      this.$store.commit('setSearchQuery', newVal)
      console.log(this.$store.state.searchQuery)
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
