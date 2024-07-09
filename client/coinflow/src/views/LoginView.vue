<template>
  <div class="login-container">
    <div id="login">
      <h1>Login</h1>
      <input
        type="text"
        name="username"
        v-model="input.username"
        placeholder="Username"
        id="login-username"
      />
      <input
        type="password"
        name="password"
        v-model="input.password"
        placeholder="Password"
        id="login-password"
      />
      <button type="button" v-on:click="login()">Login</button>
      <p>{{ output.message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      input: {
        username: '',
        password: ''
      },
      output: {
        message: ''
      }
    }
  },
  methods: {
    async login() {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: this.input.username, password: this.input.password })
      })
      if (response.ok) {
        this.$store.commit('setAuthentication', {
          isAuthenticated: true,
          username: this.input.username
        })
        this.$emit('authenticated', true)
      }
      const data = await response.json()
      this.output.message = data.msg
      return data
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: row;
  width: auto;
  border: 1px solid #cccccc;
  background-color: #ffffff;
  margin: auto;
  margin-top: auto;
  padding: 20px;
}

#login-username,
#login-password {
  width: 200px;
}
</style>
