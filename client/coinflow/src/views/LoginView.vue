<template>
  <div class="login-view-container">
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
        <button type="button" @click="login()" id="login-button" class="login-element">
          Login
        </button>
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
        return await response.json()
      } else {
        const data = await response.json()
        this.$store.commit('setSnackbarMessage', {
          type: 'error',
          text: `${data.msg}`
        })
        return data
      }
    },
    checkSignup() {
      if (!/^[a-z]{3,16}$/.test(this.input.username)) {
        return {
          valid: false,
          reason: 'Invalid username'
        }
      }

      if (this.details.repeatPassword !== this.input.password) {
        return {
          valid: false,
          reason: 'Passwords not matching'
        }
      }

      if (this.input.password.length < 8) {
        return {
          valid: false,
          reason: 'Password should be at least 8 characters long'
        }
      }

      if (this.details.name.length === 0 || this.details.surname.length === 0) {
        return {
          valid: false,
          reason: 'Missing name details'
        }
      }
      return {
        valid: true
      }
    },
    async signup() {
      let check = this.checkSignup()
      if (!check.valid) {
        this.$store.commit('setSnackbarMessage', {
          type: 'error',
          text: check.reason
        })
        return
      }
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: this.details.name.trim(),
          surname: this.details.surname.trim(),
          username: this.input.username.trim(),
          password: this.input.password
        })
      })
      if (response.ok) {
        this.showSignup = false
        this.$store.commit('setSnackbarMessage', {
          type: 'success',
          text: 'User successfully registered'
        })
        return await response.json()
      } else {
        const data = await response.json()
        this.$store.commit('setSnackbarMessage', {
          type: 'error',
          text: data.msg
        })
        return data
      }
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
  justify-content: center;
  align-content: center;
  align-items: center;
  width: auto;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background-color: var(--color-background);
  margin: 10px;
  padding: 20px;
}

.login-view-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-content: center;
  align-items: center;
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
