<template>
  <div class="editor-wrapper">
    <button type="button" @click="$emit('cancel')">Cancel</button>
    <div class="editor-title">
      <h1 v-if="isNewTransaction()">Create Transaction</h1>
      <h1 v-if="!isNewTransaction()">Edit Transaction</h1>
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
    <div class="add-user-quota-wrapper" v-if="cachedUsers && remainingUsers.length > 0">
      <select v-model="selectedUsername">
        <option v-for="user in remainingUsers" :key="user.username">
          {{ user.username }} ({{ user.name }} {{ user.surname }})
        </option>
      </select>
      <button
        type="button"
        name="add-user-quota-button"
        v-if="selectedUsername !== ''"
        @click="onAddUserQuotaClick"
      >
        Add user
      </button>
    </div>
    <div class="user-quotas-editor-wrapper">
      <div>Total cost: {{ prettyQuota(totalCost) }}</div>
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
    <button type="button" name="submit-transaction-button" @click="onSubmitTransaction">
      Submit
    </button>
  </div>
</template>

<script>
import fetcher from '@/utils/fetch/fetcher.js'
import transactions from '@/utils/transactions.js'
import prettifier from '@/utils/prettifier.js'

export default {
  data() {
    return {
      currentTransaction: {},
      selectedUsername: '',
      cachedUsers: undefined,
      pickedDate: undefined,
      dataReady: false
    }
  },
  props: {
    transaction: Object
  },
  methods: {
    isNewTransaction() {
      return this.transaction === undefined || this.transaction.transactionId === undefined
    },
    onAddUserQuotaClick() {
      if (this.selectedUsername === '') return

      if (!this.currentTransaction.quotas) {
        this.currentTransaction.quotas = {}
      }

      if (!this.currentTransaction.quotas[this.selectedUsernameOnly]) {
        let newQuotas = {}
        Object.assign(newQuotas, this.currentTransaction.quotas)
        newQuotas[this.selectedUsernameOnly] = 0.0
        this.currentTransaction.quotas = newQuotas
      }

      this.selectedUsername = ''
    },
    freshTransaction() {
      let freshTransaction = {}
      freshTransaction.author = this.$store.state.username
      freshTransaction.quotas = {}
      freshTransaction.quotas[this.$store.state.username] = 0.0
      let today = new Date()
      freshTransaction.year = today.getFullYear()
      freshTransaction.month = today.getMonth() + 1
      freshTransaction.day = today.getDate()
      return freshTransaction
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
        let quotaAmount = transactions.roundAmount(Number(transaction.quotas[quota]))
        if (Number(quotaAmount) === 0.0) {
          delete transaction.quotas[quota]
        } else {
          transaction.quotas[quota] = quotaAmount
        }
      }
    },
    async onSubmitTransaction() {
      let transactionCheck = this.checkTransaction(this.currentTransaction)
      if (!transactionCheck.valid) {
        console.log(`Invalid transaction: ${transactionCheck.cause}`)
        this.$store.commit('setSnackbarMessage', {
          type: 'error',
          title: 'Invalid transaction',
          text: transactionCheck.cause
        })
      } else {
        this.formatTransaction(this.currentTransaction)
        if (this.isNewTransaction()) {
          await fetcher.submitNewTransaction(this.currentTransaction)
        } else {
          await fetcher.submitEditedTransaction(
            this.transaction.year,
            this.transaction.month,
            this.transaction.transactionId,
            this.currentTransaction
          )
        }
        let snackbarMessage = this.isNewTransaction()
          ? `Added transaction '${this.currentTransaction.description} (${this.prettyQuota(this.totalCost)})'`
          : `Edited with '${this.currentTransaction.description} (${this.prettyQuota(this.totalCost)})'`
        this.$store.commit('setSnackbarMessage', {
          type: 'success',
          text: snackbarMessage
        })
        await this.$emit('transactionSubmitted')
      }
    },
    prettyQuota(quota) {
      return prettifier.prettyAmount(quota) + '€'
    }
  },
  computed: {
    selectedUsernameOnly() {
      return this.selectedUsername.split(' ')[0]
    },
    currentDate() {
      if (!this.pickedDate) {
        let today = new Date()
        return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
      }
      return this.pickedDate.toISOString().substring(0, 10)
    },
    totalCost() {
      return transactions.computeTotalCost(this.currentTransaction)
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
  async mounted() {
    this.cachedUsers = (await fetcher.usersSearch('')).slice()
    if (this.transaction === undefined) {
      this.currentTransaction = this.freshTransaction()
    } else {
      this.currentTransaction = transactions.clone(this.transaction)
    }
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
</style>
