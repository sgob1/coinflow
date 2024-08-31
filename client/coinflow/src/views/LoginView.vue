<template>
  <div class="login-container card">
    <div id="login" class="login-box" v-if="!showSignup">
      <h1>Welcome to Coinflow</h1>
      <input
        type="text"
        name="username"
        v-model="input.username"
        placeholder="Username"
        id="login-username"
        class="login-element"
        required="true"
      />
      <input
        type="password"
        name="password"
        v-model="input.password"
        placeholder="Password"
        id="login-password"
        class="login-element"
        required="true"
      />
      <button type="button" @click="login()" id="login-button" class="login-element">Login</button>
      <button type="button" @click="showSignup = true" id="login-button" class="login-element">
        Signup
      </button>
    </div>
    <div id="registration" class="login-box" v-if="showSignup">
      <h1>Signup</h1>
      <input
        type="text"
        name="name"
        v-model="details.name"
        placeholder="Name"
        id="signup-name"
        class="login-element"
        required="true"
      />
      <input
        type="text"
        name="surname"
        v-model="details.surname"
        placeholder="Surname"
        id="signup-surname"
        class="login-element"
        required="true"
      />
      <input
        type="text"
        name="username"
        v-model="input.username"
        placeholder="Username"
        id="signup-username"
        class="login-element"
        pattern="[a-z]{3,16}"
        required="true"
      />
      <input
        type="password"
        name="password"
        v-model="input.password"
        placeholder="Password"
        id="signup-password"
        class="login-element"
        pattern="\w{3,64}"
        required="true"
      />
      <input
        type="password"
        name="password"
        v-model="details.repeatPassword"
        placeholder="Repeat password"
        id="signup-password-repeat"
        class="login-element"
        pattern="\w{3,64}"
        required="true"
      />
      <button type="button" @click="signup()" id="signup-button" class="login-element">
        Signup
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      details: {
        name: '',
        surname: '',
        repeatPassword: ''
      },
      input: {
        username: '',
        password: ''
      },
      showSignup: false
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
      this.$store.commit('setSnackbarMessage', {
        type: 'error',
        message: data.msg
      })
      return data
    },
    async signup() {
      this.output.message = ''
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: this.details.name,
          surname: this.details.surname,
          username: this.input.username,
          password: this.details.repeatPassword
        })
      })
      if (response.ok) {
        this.showSignup = false
      }
      const data = await response.json()
      this.$store.commit('setSnackbarMessage', {
        type: 'error',
        message: data.msg
      })
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
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background-color: var(--color-background);
  margin: 10px;
  padding: 20px;
}

.login-element {
  width: 300px;
  margin: 10px auto;
  padding: 5px;
  font-size: 1.2em;
  border: 1px solid var(--color-border);
  border-radius: 40px;
}

#login-button {
  background-color: var(--color-accent);
  color: var(--color-text-inverted);
}
</style>
