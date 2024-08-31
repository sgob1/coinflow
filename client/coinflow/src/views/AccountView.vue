<template>
  <div class="account-container">
    <div class="card" id="account-info">
      <h2>Account Info</h2>
      <p>{{ accountInfo.name }} {{ accountInfo.surname }}</p>
      <p>username: {{ accountInfo.username }}</p>
    </div>
    <HelpComponent />
  </div>
</template>

<script>
import HelpComponent from '@/components/HelpComponent.vue'
export default {
  components: {
    HelpComponent
  },
  data() {
    return {
      accountInfo: {}
    }
  },
  methods: {
    async whoami() {
      const response = await fetch('/api/budget/whoami')
      if (response.ok) {
        this.accountInfo = await response.json()
      } else {
        this.$router.replace({ name: 'login' })
      }
      return response
    }
  },
  async mounted() {
    await this.whoami()
  }
}
</script>

<style>
.account-container {
  display: flex;
  gap: 30px;
  flex-direction: column;
  justify-content: start;
  align-items: center;
}
.card {
  margin: 0px 30px;
}
</style>
