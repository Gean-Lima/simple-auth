import { defineNuxtPlugin } from 'nuxt/app'
import { useAuthStore } from './store/auth'

export default defineNuxtPlugin(async (_nuxtApp) => {
  const authStore = useAuthStore()
  await authStore._setup()

  return {
    provide: {
      auth: authStore,
    },
  }
})
