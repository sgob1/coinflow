<script>
export default {
  name: 'NavBar',
  data() {
    return {}
  }
}
</script>

<template>
  <div id="navbar" class="container">
    <nav class="navbar">
      <div class="logo">
        <div v-if="isAuthenticated">
          <router-link to="/" class="nav-button">Coinflow</router-link>
        </div>
      </div>
      <div class="search">
        <div v-if="isAuthenticated">
          <h2>Search</h2>
        </div>
      </div>
      <div class="settings">
        <div v-if="isAuthenticated">
          <h2>Settings</h2>
        </div>
      </div>
    </nav>
  </div>
</template>
