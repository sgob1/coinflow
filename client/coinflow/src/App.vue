<script>
import HeaderBarComponent from './components/HeaderBarComponent.vue'

export default {
  name: 'App',
  components: {
    HeaderBarComponent
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
  mounted() {},
  methods: {
    onAuthentication() {
      this.isAuthenticated = this.$store.state.isAuthenticated
      this.username = this.$store.state.username
      this.$router.replace({ name: 'main' })
    },
    logout() {
      this.$store.commit('logout')
      this.isAuthenticated = this.$store.state.isAuthenticated
      this.username = this.$store.state.username
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
        @see-user-transactions-click="
          (username) => this.$refs.headerBar.setQuery(`user:${username}`)
        "
      />
    </div>
    <vue3-snackbar top center groups dense :duration="4000">
      <template #message-action="{ message, isDismissible, dismiss }"> </template>
    </vue3-snackbar>
  </div>
</template>

<style>
body {
  background-color: #f0f0f0;
  font-size: 1.2em;
}

.button {
  margin: 20px;
  padding: 10px;
  border-radius: 20px;
  background-color: #f0f0f0;
}

.button-green {
  color: 1px solid #65ec87;
}

.button-red {
  color: 1px solid #ec6565;
}

#nav-host {
  justify-content: center;
  width: 100%;
  margin: auto;
  padding-top: 60px;
}
</style>
