<script>
import HeaderBarComponent from './components/HeaderBarComponent.vue'
import SnackbarComponent from './components/SnackbarComponent.vue'
import searchUtils from '@/utils/search/searchUtils.js'

export default {
  name: 'App',
  components: {
    HeaderBarComponent,
    SnackbarComponent
  },
  data() {
    return {
      dataReady: false,
      isAuthenticated: false,
      username: ''
    }
  },
  async created() {
    const result = await this.$store.dispatch('fetchAuth')
    if (result.ok) {
      this.isAuthenticated = this.$store.state.isAuthenticated
      this.username = this.$store.state.username
    }

    let firstDestination = 'login'
    if (this.isAuthenticated) {
      firstDestination = 'main'
    }
    this.$router.replace({ name: firstDestination })
    this.dataReady = true
  },
  methods: {
    onAuthentication() {
      this.isAuthenticated = this.$store.state.isAuthenticated
      this.username = this.$store.state.username
      this.$router.replace({ name: 'main' })
    },
    onFiltersChanged(filters) {
      let originalQuery = this.$refs.headerBar.searchQuery
      let newQuery = searchUtils.setFiltersInSearchQuery(originalQuery, filters)
      this.$refs.headerBar.setQuery(newQuery)
    },
    onUserTransactionsClick(username) {
      let originalQuery = this.$refs.headerBar.searchQuery
      let clearedQuery = searchUtils.clearQuery(originalQuery)
      let newQuery = searchUtils.setFiltersInSearchQuery(clearedQuery, { user: username })
      this.$refs.headerBar.setQuery(newQuery)
    },
    onCategoryTransactionsClick(category) {
      let originalQuery = this.$refs.headerBar.searchQuery
      let clearedQuery = searchUtils.clearQuery(originalQuery)
      let newQuery = searchUtils.setFiltersInSearchQuery(clearedQuery, { category: category })
      this.$refs.headerBar.setQuery(newQuery)
    }
  }
}
</script>

<template>
  <div id="app">
    <HeaderBarComponent ref="headerBar" />
    <div id="nav-host" v-if="dataReady">
      <RouterView
        @authenticated="onAuthentication"
        @see-user-transactions-click="(username) => onUserTransactionsClick(username)"
        @see-category-click="(category) => onCategoryTransactionsClick(category)"
        @filters-changed="(filters) => onFiltersChanged(filters)"
      />
    </div>
    <SnackbarComponent :duration="4000" />
  </div>
</template>

<style>
#app {
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  justify-content: flex-start;
}

body {
  font-size: 1.2em;
}

.button {
  margin: 20px;
  padding: 10px;
  border-radius: 20px;
}

.button-green {
  color: 1px solid #65ec87;
}

.button-red {
  color: 1px solid #ec6565;
}

#nav-host {
  padding-top: 80px;
  justify-content: center;
  width: 100%;
  margin: auto;
}
</style>
