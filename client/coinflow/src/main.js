import './assets/main.css'

import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'

const store = createStore({
  state() {
    return {
      isAuthenticated: false,
      username: ''
    }
  },
  mutations: {
    setAuthentication(state, payload) {
      state.isAuthenticated = payload.isAuthenticated
      state.username = payload.username
    },
    logout(state) {
      state.isAuthenticated = false
      state.username = ''
    }
  },
  actions: {
    async fetchAuth({ commit }) {
      const response = await fetch('/api/budget/whoami')
      if (response.ok) {
        const user = await response.json()
        commit('setAuthentication', { isAuthenticated: true, username: user.username })
      } else {
        commit('logout')
      }
      return response
    }
  }
})

const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')
