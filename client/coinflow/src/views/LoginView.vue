<template>
  <div class="login-container">
    <div id="login" class="login-box">
      <h1>Login</h1>
      <input
        type="text"
        name="username"
        v-model="input.username"
        placeholder="Username"
        id="login-username"
        class="login-element"
      />
      <input
        type="password"
        name="password"
        v-model="input.password"
        placeholder="Password"
        id="login-password"
        class="login-element"
      />
      <button type="button" @click="login()" id="login-button" class="login-element">Login</button>
      <p>{{ output.message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
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
.login-box {
  display: flex;
  flex-direction: column;
}

.login-container {
  display: flex;
  flex-direction: column;
  width: auto;
  border: 1px solid #cccccc;
  border-radius: 20px;
  background-color: #ffffff;
  margin: auto;
  margin-top: auto;
  padding: 20px;
}

.login-element {
  width: 300px;
  margin: 10px auto;
  padding: 5px;
  font-size: 1.2em;
  border: 1px solid #777777;
  border-radius: 15px;
}

#login-button {
  background-color: #4b69fc;
  color: #ffffff;
}
</style>
