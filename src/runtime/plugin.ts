import { defineNuxtPlugin, useCookie } from 'nuxt/app'
import { useAuthStore } from './store/auth'
import { watch } from 'vue'

export default defineNuxtPlugin(async (_nuxtApp) => {
  const authStore = useAuthStore()
  await authStore._setup()

  watch(useCookie('_auth__token'), (value) => {
    if (!value) {
      authStore.clear()
      authStore.redirect()
    }
  })

  return {
    provide: {
      auth: authStore,
    },
  }
})
