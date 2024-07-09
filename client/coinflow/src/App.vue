<template>
  <div id="app">
    <!-- <div id="nav"> -->
    <!--   <router-link v-if="authenticated" to="/" v-on:click="logout()" replace>Logout</router-link> -->
    <!-- </div> -->
    <RouterView @authenticated="setAuthenticated" />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      authenticated: false
    }
  },
  mounted() {
    if (!this.authenticated) {
      this.$router.replace({ name: 'login' })
    }
  },
  methods: {
    setAuthenticated(status) {
      this.authenticated = status
    },
    logout() {
      this.authenticated = false
    }
  }
}
</script>

<style>
body {
  background-color: #f0f0f0;
}
h1 {
  padding: 0;
  margin-top: 0;
}
#app {
  display: flex;
  justify-content: center;
  width: auto;
  margin: auto;
}
</style>
