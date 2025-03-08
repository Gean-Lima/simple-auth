import { defineNuxtRouteMiddleware, useNuxtApp, useRuntimeConfig } from 'nuxt/app'
import type { ModuleOptions } from '../types/module'

export default defineNuxtRouteMiddleware(() => {
  const auth = useNuxtApp().$auth;
  const options = useRuntimeConfig().public.simpleAuth as ModuleOptions

  if (!auth.isLogged) return options.loginPage
})
