<script setup>
import { ref } from 'vue'

const displayedTransactions = ref([])

async function getTransactions() {
  console.log('Fetching transactions')
  const transactions = await fetch('/api/budget/')
  console.log(transactions)
  displayedTransactions.value = await transactions.json()
}

/*async function postData(transaction) {
  console.log("POSTing transaction")
  const response = await fetch("/api/budget/2024/3", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });
  const result = await response.json();
}*/
</script>

<template>
  <button @click="getTransactions">{{ displayedTransactions }}</button>
  <p>{{ displayedTransactions }}</p>
</template>
