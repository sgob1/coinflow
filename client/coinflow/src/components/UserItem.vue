<template>
  <div class="user-item-container card" @click="onItemClick">
    <div class="user-item-first-row">
      <div>{{ user.name }} {{ user.surname }}</div>
      <div>User</div>
    </div>
    <div class="user-item-second-row" v-if="!isOpen">
      <div>{{ user.username }}</div>
    </div>
    <div v-if="isOpen">
      <div>
        {{ userSentence }}
      </div>
      <div>
        <button type="button" @click="onUserButtonClick">See transactions</button>
      </div>
    </div>
  </div>
</template>

<script>
import prettifier from '@/utils/prettifier.js'
import fetcher from '@/utils/fetch/fetcher.js'

export default {
  data() {
    return {
      isOpen: false,
      userBalance: {}
    }
  },
  props: {
    user: Object
  },
  computed: {
    userSentence() {
      if (this.user.username === this.$store.state.username)
        return prettifier.myTotal(Number(this.userBalance[this.user.username]), '€')
      else
        return prettifier.userSentence(
          this.userBalance[this.user.username],
          '€',
          this.user.username
        )
    }
  },
  methods: {
    async onItemClick() {
      if (!this.isOpen) {
        this.userBalance = await fetcher.balance(this.user.id)
      }
      this.isOpen = !this.isOpen
    },
    onUserButtonClick() {
      this.$emit('seeUserTransactionsClick', this.user.username)
    }
  }
}
</script>

<style scoped>
.user-item-first-row,
.user-item-second-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

.user-item-first-row {
  font-size: 1.2em;
  font-weight: bold;
}
.user-item-second-row {
  font-size: 1em;
  font-style: italic;
  color: rgba(0, 0, 0, 0.4);
}
.buttons-section {
  display: flex;
  flex-direction: column;
}
</style>
