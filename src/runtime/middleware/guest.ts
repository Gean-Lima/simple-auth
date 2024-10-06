import { defineNuxtRouteMiddleware, useRuntimeConfig } from 'nuxt/app'
import { useAuth } from '../composables/useAuth'
import type { ModuleOptions } from '../types/module'

export default defineNuxtRouteMiddleware(() => {
  const auth = useAuth()
  const options = useRuntimeConfig().public.simpleAuth as ModuleOptions

  if (auth.isLogged) return options.homePage
})
