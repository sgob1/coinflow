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
  font-size: 1.2em;
}

.container {
  margin: 10px 0px;
  padding: 10px;
  border: 1px solid #777777;
  border-radius: 20px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.4);
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
  display: flex;
  justify-content: center;
  width: 100%;
  margin: auto;
}
</style>
