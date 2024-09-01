<template>
  <div id="headerbar">
    <img
      src="@/assets/app-icon.png"
      alt="Coinflow logo"
      class="icon"
      @click="onCoinflowLogoClick"
      v-if="!darkSchemeOn"
    />
    <img
      src="@/assets/app-icon-dark.png"
      alt="Coinflow logo"
      class="icon"
      @click="onCoinflowLogoClick"
      v-if="darkSchemeOn"
    />
    <div id="search-bar" class="search-bar" v-if="showSearchBar">
      <input type="text" v-model="searchQuery" placeholder="Search..." />
      <img
        src="@/assets/close.png"
        alt="Back"
        class="icon-small"
        @click="onClearClick"
        v-if="searchQuery.length > 0 && !darkSchemeOn"
      />
      <img
        src="@/assets/close-dark.png"
        alt="Back"
        class="icon-small"
        @click="onClearClick"
        v-if="searchQuery.length > 0 && darkSchemeOn"
      />
    </div>
    <div class="user-account" @click="onShowAccountIconClick">
      <img
        src="@/assets/user.png"
        alt="Account"
        class="user-icon"
        v-if="showAccountIcon && !darkSchemeOn"
      />
      <img
        src="@/assets/user-dark.png"
        alt="Account"
        class="user-icon"
        v-if="showAccountIcon && darkSchemeOn"
      />
      <p>
        {{ thisUsername }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { searchQuery: '', darkSchemeOn: false }
  },
  methods: {
    onClearClick() {
      this.searchQuery = ''
    },
    onCoinflowLogoClick() {
      window.location.reload()
    },
    onShowAccountIconClick() {
      this.$router.replace({ name: 'account' })
    },
    setQuery(value) {
      this.searchQuery = value
    },
    getQuery() {
      return this.searchQuery
    }
  },
  computed: {
    thisUsername() {
      return this.$store.state.username
    },
    showSearchBar() {
      return this.$route.name === 'main'
    },
    showAccountIcon() {
      return this.$route.name !== 'login'
    }
  },
  watch: {
    searchQuery: function (newVal, oldVal) {
      this.$store.commit('setSearchQuery', newVal)
    }
  },
  mounted() {
    this.darkSchemeOn =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)')
    darkModePreference.addEventListener('change', (e) => (this.darkSchemeOn = !this.darkSchemeOn))
  }
}
</script>

<style scoped>
.icon {
  height: 50px;
  width: 50px;
}

.user-icon {
  height: 34px;
  width: 34px;
}

.icon-small {
  height: 25px;
  width: 25px;
  margin: auto 8px;
  padding: 2px;
}

#headerbar {
  position: fixed;
  z-index: 9999999;
  top: 0;
  left: 0;
  background-color: var(--color-accent-soft);
  border: 1px solid #cccccc;
  padding: 8px;
  margin: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 100%;
  max-width: 100%;
}

.search-bar {
  padding: 8px;
  margin: 0px;
  display: flex;
  justify-content: center;
  max-width: 75%;
}

.search-bar input {
  min-height: 40px;
  border-radius: 40px;
  padding: 8px;
  max-width: 75%;
  width: 1024px;
  color: var(--color-text);
}

.user-account {
  display: flex;
  flex-direction: column;
  justify-content: right;
  align-items: center;
}

.user-account p {
  font-size: 0.8em;
  margin: 1px;
}
</style>
