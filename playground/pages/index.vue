<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
})

const auth = useAuth()

const email = ref('mraz.joannie@example.org')
const passwd = ref('password')

function clickLogin() {
  auth.login({ email: email.value, password: passwd.value })
    .catch((err) => {
      console.log(err)
    })
}
</script>

<template>
  <div class="box-login">
    <div class="box-input">
      <input
        v-model="email"
        type="email"
        required
        placeholder="E-mail"
      >
    </div>

    <div class="box-input">
      <input
        v-model="passwd"
        type="password"
        required
        placeholder="Password"
      >
    </div>

    <button @click="clickLogin">
      Login
    </button>
  </div>
</template>

<style scoped>
.box-login {
    margin: 0 auto;
    max-width: 300px;
}

.box-login button {
    display: block;
    margin: 0 auto;
}

.box-input {
    margin-bottom: 10px;
}

.box-input input {
    width: 100%;
}
</style>
