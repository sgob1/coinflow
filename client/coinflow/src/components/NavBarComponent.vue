<script>
export default {
  name: 'NavBar',
  data() {
    return { searchQuery: '' }
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated
    }
  },
  methods: {
    performSearch() {
      this.$store.commit('setSearchQuery', this.searchQuery)
      this.$router.replace({ name: 'search' })
    }
  }
}
</script>

<template>
  <div id="navbar" class="container">
    <nav class="navbar">
      <div class="nav-left">
        <div v-if="isAuthenticated">
          <router-link to="/" class="nav-button">Dashboard</router-link>
        </div>
      </div>
      <div class="nav-center">
        <div v-if="isAuthenticated">
          <form id="nav-searchform" @submit.prevent="performSearch">
            <input v-model="searchQuery" placeholder="Search..." class="nav-searchbar" />
            <input type="submit" class="nav-button" value="Search" />
          </form>
        </div>
      </div>
      <div class="nav-right">
        <div v-if="isAuthenticated">
          <router-link to="/" class="nav-button">Options</router-link>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.navbar {
  background-color: #4b69fc;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0px;
  border-bottom: 1px solid #ffffff;
}

.nav-button {
  display: inline-block;
  padding: 5px 10px;
  margin: 5px;
  background-color: #4b69fc;
  border: 2px solid #ffffff;
  border-color: #4b69fc;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  transition: all 0.2s ease;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
}

.nav-left {
  display: flex;
  align-items: center;
  order: 1;
}

.nav-center {
  display: flex;
  align-items: center;
  justify-content: center;
  order: 2;
}

.nav-right {
  display: flex;
  align-items: center;
  order: 3;
}

.nav-searchbar {
  color: #222222;
  border: 1px solid #ffffff;
  padding: 5px 10px;
  margin: 5px;
  border-radius: 30px;
  background-color: #e2e7ff;
  font-size: 14px;
}

.nav-button:hover {
  background-color: #6680fc;
  box-shadow: 0px 0px 10px #444444;
  transform: scale(1.02);
}

.nav-button:active {
  transition: transform 0.15s;
  transform: scale(0.9);
}
</style>
