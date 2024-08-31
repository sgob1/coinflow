import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      isAuthenticated: false,
      username: '',
      searchQuery: '',
      snackbarMessage: undefined
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
    },
    setSearchQuery(state, query) {
      state.searchQuery = query
    },
    setSnackbarMessage(state, message) {
      state.snackbarMessage = message
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

export default store
