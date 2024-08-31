<template>
  <div id="snackbar-wrapper">
    <div class="snackbar-list" v-for="(message, key) in messageQueue" :key="key">
      <div
        class="card snackbar success"
        v-if="messageQueue[key] !== undefined && messageQueue[key].type === 'success'"
      >
        {{ message.text }}
      </div>
      <div
        class="card snackbar error"
        v-if="messageQueue[key] !== undefined && messageQueue[key].type === 'error'"
      >
        Error: {{ message.text }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    duration: Number(4000)
  },
  data() {
    return {
      timerOn: false,
      messageQueue: []
    }
  },
  computed: {
    ...mapState(['snackbarMessage'])
  },
  methods: {
    pushToQueue(message) {
      this.messageQueue.push(message)
    },
    shiftFromQueue() {
      return this.messageQueue.shift()
    }
  },
  watch: {
    snackbarMessage: async function (newVal, oldVal) {
      if (this.snackbarMessage !== undefined) {
        this.pushToQueue(newVal)
        setTimeout(() => {
          this.shiftFromQueue()
        }, this.duration)
        this.$store.commit('setSnackbarMessage', undefined)
      }
    }
  }
}
</script>

<style>
#snackbar-wrapper {
  position: fixed;
  bottom: 16px;
  right: 24px;
  z-index: 99999999;
}
.snackbar-list {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
}
.success {
  background-color: var(--color-success-soft);
}
.error {
  background-color: var(--color-error);
}
</style>
