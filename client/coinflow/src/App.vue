<script>
import NavBarComponent from './components/NavBarComponent.vue'

export default {
  name: 'App',
  components: {
    NavBarComponent
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
    <NavBarComponent />
    <div id="nav-host" v-if="dataReady">
      <RouterView @authenticated="onAuthentication" />
    </div>
  </div>
</template>

<style>
body {
  background-color: #f0f0f0;
}
h1 {
  padding: 0;
  margin-top: 0;
}
#nav-host {
  display: flex;
  justify-content: center;
  width: auto;
  margin: auto;
}
</style>
