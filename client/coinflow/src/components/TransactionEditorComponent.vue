<template>
  <div class="editor-wrapper">
    <div class="editor-title">
      <h1 v-if="isNew">Create Transaction</h1>
      <h1 v-if="!isNew">Edit Transaction</h1>
    </div>
    <h2>Description</h2>
    <input
      type="text"
      v-model="currentTransaction.description"
      value="currentTransaction.description"
      required
    />
    <h2>Category</h2>
    <input
      type="text"
      v-model="currentTransaction.category"
      value="currentTransaction.category"
      pattern="^[A-Za-z]+$"
      required
    />
    <h2>Date</h2>
    <div class="date-editor-wrapper">
      <input type="date" v-model="date" @input="onSubmitDate" value="currentDate" required />
    </div>
    <h2>User Quotas</h2>
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
          pattern="^-?[0-9]*\.?[0-9]*$"
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
    <div class="final-editor-row">
      <button type="button" name="submit-transaction-button" @click="onSubmitTransaction">
        Submit
      </button>
      <button
        type="button"
        name="submit-transaction-button"
        @click="onDeleteTransaction"
        v-if="!isNew"
      >
        Delete
      </button>
    </div>
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
      dataReady: false,
      isNew: this.isNewTransaction()
    }
  },
  props: {
    transaction: Object
  },
  methods: {
    isNewTransaction() {
      return (
        !this.currentTransaction ||
        (!this.currentTransaction.transactionId && !(this.currentTransaction.transactionId === 0))
      )
    },
    onAddUserQuotaClick() {
      if (this.selectedUsername === '') return

      if (!this.currentTransaction.quotas) {
        this.currentTransaction.quotas = {}
      }

      if (!this.currentTransaction.quotas[this.selectedUsername]) {
        let newQuotas = {}
        Object.assign(newQuotas, this.currentTransaction.quotas)
        newQuotas[this.selectedUsername] = 0.0
        this.currentTransaction.quotas = newQuotas
      }

      this.selectedUsername = ''
    },
    roundAmount(num) {
      return (Math.round((num + Number.EPSILON) * 100) / 100).toFixed(2)
    },
    resetTransaction() {
      this.currentTransaction = {}
      this.currentTransaction.author = this.$store.state.username
      this.currentTransaction.quotas = {}
      this.currentTransaction.quotas[this.$store.state.username] = 0.0
      let today = new Date()
      this.currentTransaction.year = today.getFullYear()
      this.currentTransaction.month = today.getMonth() + 1
      this.currentTransaction.day = today.getDate()
    },
    initDate() {
      if (
        !this.transaction ||
        !this.transaction.year ||
        !this.transaction.month ||
        !this.transaction.day
      ) {
        this.pickedDate = new Date()
        this.date = this.currentDate
      } else {
        this.pickedDate = new Date(
          this.transaction.year,
          this.transaction.month - 1,
          this.transaction.day + 1
        )
        this.date = this.pickedDate.toISOString().substring(0, 10)
      }
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
    checkTransaction(transaction) {
      if (!transaction.description || transaction.description === '') {
        return {
          valid: false,
          cause: 'Empty description'
        }
      }

      if (
        !/^[A-Za-z]+$/.test(transaction.category) ||
        !transaction.category ||
        transaction.category === ''
      ) {
        return {
          valid: false,
          cause: 'Wrong or empty category'
        }
      }

      if (Number.isNaN(new Date(transaction.year, transaction.month, transaction.day).valueOf())) {
        return {
          valid: false,
          cause: 'Wrong date'
        }
      }

      if (Number(transaction.quotas[this.$store.state.username]) === 0.0) {
        return { valid: false, cause: 'Author has no quota' }
      }

      for (let quota in transaction.quotas) {
        if (isNaN(transaction.quotas[quota])) {
          return { valid: false, cause: `Invalid quota for ${quota}` }
        }
      }

      return { valid: true }
    },
    formatTransaction(transaction) {
      transaction.description = transaction.description.trim()
      transaction.category = transaction.category.trim()
      for (let quota in transaction.quotas) {
        let quotaAmount = this.roundAmount(Number(transaction.quotas[quota]))
        if (quotaAmount === 0.0) {
          delete transaction.quotas[quota]
        } else {
          transaction.quotas[quota] = this.roundAmount(Number(transaction.quotas[quota]))
        }
      }
    },
    async onSubmitTransaction() {
      let transactionCheck = this.checkTransaction(this.currentTransaction)
      if (!transactionCheck.valid) {
        console.log(`Invalid transaction: ${transactionCheck.cause}`)
        alert(`Invalid transaction: ${transactionCheck.cause}`)
      } else {
        this.formatTransaction(this.currentTransaction)
        if (this.isNew) {
          await fetcher.submitNewTransaction(this.currentTransaction)
        } else {
          await fetcher.submitEditedTransaction(
            this.transaction.year,
            this.transaction.month,
            this.transaction.transactionId,
            this.currentTransaction
          )
        }
        await this.$emit('transactionSubmitted')
      }
    },
    async onDeleteTransaction() {
      await fetcher.deleteTransaction(this.transaction)
      await this.$emit('transactionDeleted')
    }
  },
  computed: {
    currentDate() {
      if (!this.pickedDate) {
        let today = new Date()
        return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
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
      this.initDate()
      if (this.isNewTransaction()) {
        this.resetTransaction()
        this.isNew = true
      } else {
        this.isNew = false
      }
    }
  },
  async mounted() {
    this.cachedUsers = (await fetcher.usersSearch('')).slice()
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
.final-editor-row {
  display: grid;
  grid-template-columns: 3fr 1fr;
}
</style>
