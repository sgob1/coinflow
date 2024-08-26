<template>
  <div class="editor-wrapper">
    <h1>Description</h1>
    <input
      type="text"
      v-model="currentTransaction.description"
      value="currentTransaction.description"
    />
    <h1>Category</h1>
    <input type="text" v-model="currentTransaction.category" value="currentTransaction.category" />
    <h1>Date</h1>
    <div class="date-editor-wrapper">
      <input type="date" v-model="date" @input="onSubmitDate" value="currentDate" />
    </div>
    <h1>User Quotas</h1>
    <div class="add-user-quota-wrapper" v-if="remainingUsers.length > 0">
      <select v-model="selectedUsername">
        <option v-for="user in remainingUsers" :key="user.username">
          {{ user.username }}
        </option>
      </select>
      <button type="button" name="add-user-quota-button" @click="onAddUserQuotaClick">
        Add user
      </button>
    </div>
    <div class="user-quotas-editor-wrapper">
      <div>Total cost: {{ totalCost }}</div>
      <div v-for="(quota, key) in currentTransaction.quotas" :key="key">
        {{ key }}:
        <input
          type="text"
          v-model="currentTransaction.quotas[key]"
          value="currentTransaction.quotas[key]"
        />
        <button
          type="button"
          name="delete-user-quota-button"
          @click="onDeleteUserQuotaClick(key)"
          v-if="canDeleteQuota(key)"
        >
          Delete quota
        </button>
      </div>
    </div>
    <!-- TODO: remove this debug print -->
    {{ currentTransaction }}
  </div>
</template>

<script>
import fetcher from '@/utils/fetch/fetcher.js'

export default {
  data() {
    return {
      currentTransaction: {},
      selectedUsername: '',
      cachedUsers: [],
      pickedDate: undefined,
      dataReady: false
    }
  },
  props: {
    transaction: Object
  },
  methods: {
    reset() {
      this.currentTransaction = {}
    },
    onAddUserQuotaClick() {
      if (this.selectedUsername === '') return

      if (!this.currentTransaction.quotas) {
        this.currentTransaction.quotas = {}
      }

      if (!this.currentTransaction.quotas[this.selectedUsername]) {
        //this.currentTransaction.quotas[this.selectedUsername] = 0.0
        let newQuotas = {}
        Object.assign(newQuotas, this.currentTransaction.quotas)
        newQuotas[this.selectedUsername] = 0.0
        this.currentTransaction.quotas = newQuotas
      }

      this.selectedUsername = ''
    },
    roundAmount(num) {
      return Math.round((num + Number.EPSILON) * 100) / 100
    },
    initDate() {
      if (
        !this.currentTransaction.year ||
        !this.currentTransaction.month ||
        !this.currentTransaction.day
      )
        this.pickedDate = new Date()
      else
        this.pickedDate = new Date(
          this.currentTransaction.year,
          this.currentTransaction.month,
          this.currentTransaction.day
        )
    },
    onSubmitDate() {
      let supportDate = new Date(this.date)
      this.currentTransaction.year = supportDate.getFullYear()
      this.currentTransaction.month = supportDate.getMonth() + 1
      this.currentTransaction.day = supportDate.getDate()
    },
    canDeleteQuota(username) {
      return username !== this.currentTransaction.author || username !== this.$store.state.username
    },
    onDeleteUserQuotaClick(username) {
      delete this.currentTransaction.quotas[username]
    },
    submit() {
      // TODO: parse transaction object and clean it if it contains spurious items
    }
  },
  computed: {
    currentDate() {
      if (!this.pickedDate) {
        return new Date()
      }
      return this.pickedDate.toISOString().substring(0, 10)
    },
    totalCost() {
      if (!this.currentTransaction.quotas) return 0

      let totalCost = 0
      for (let quota in this.currentTransaction.quotas) {
        totalCost = totalCost + Number(this.currentTransaction.quotas[quota])
      }
      return this.roundAmount(totalCost)
    },
    remainingUsers() {
      let remainingUsers = this.cachedUsers.slice()

      if (this.currentTransaction.quotas) {
        for (let user in this.currentTransaction.quotas) {
          let indexOfUser = -1

          for (let i = 0; i < remainingUsers.length; i++) {
            if (user === remainingUsers[i].username) indexOfUser = i
          }

          if (indexOfUser > -1) remainingUsers.splice(indexOfUser, 1)
        }
      }

      return remainingUsers
    }
  },
  watch: {
    transaction: function (newVal) {
      Object.assign(this.currentTransaction, newVal)
    }
  },
  async mounted() {
    this.cachedUsers = (await fetcher.usersSearch('')).slice()
    this.initDate()
    this.dataReady = true
  }
}
</script>

<style>
.editor-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 300px;
}
.date-editor-wrapper,
.add-user-quota-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: left;
}
input {
  font-size: 1.1em;
}
input:invalid {
  background-color: ivory;
  border: none;
  outline: 2px solid red;
  border-radius: 5px;
}
</style>
