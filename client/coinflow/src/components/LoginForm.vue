<script setup>
const username = defineModel('username')
const password = defineModel('password')

async function signin() {
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
</script>

<template>
  <p>{{ username }}</p>
  <p>{{ password }}</p>
  <form @submit.prevent="signin">
    <input v-model="username" placeholder="username" />
    <input v-model="password" placeholder="password" type="password" />
    <input type="submit" value="log in" />
  </form>
</template>
