<script setup>
import { ref } from 'vue'

const result = ref([])
const username = defineModel('username')
const password = defineModel('password')

async function signup() {
  console.log('Submitting user infos!')
  const results = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'john',
      password: 'notapass',
      name: 'John',
      surname: 'Doe'
    })
  })
  result.value = await results.json()
  console.log(result.value)
}

async function signin() {
  console.log({ username: username.value, password: password.value })
  const res = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username: username.value, password: password.value })
  })
  const data = await res.json()
  console.log(data)
}

async function balance() {
  console.log('Balance!')
  const results = await fetch('/api/balance')
  result.value = await results.json()
  console.log(result.value)
}
</script>

<template>
  <p>{{ username }}</p>
  <p>{{ password }}</p>
  <form @submit.prevent="signin">
    <input v-model="username" placeholder="username" />
    <input v-model="password" placeholder="password" type="password" />
    <input type="submit" value="log in" />
  </form>
  <button @click="signup">Signup!</button>
  <button @click="signin">Signin!</button>
  <button @click="balance">Balance!</button>
  <p>{{ result }}</p>
</template>
