<template>
  <div>
    <h1>{{ auth.user.name }}</h1>
    <p><strong>E-mail:</strong> {{ auth.user.email }}</p>

    <button @click="auth.logout">
      Logout
    </button>
  </div>
</template>

<script setup>
const auth = useAuth()

definePageMeta({
  middleware: 'auth',
})
</script>
