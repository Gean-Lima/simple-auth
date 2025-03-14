import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from 'nuxt/app'
import type { ModuleOptions } from '../types/module'
import { useAuth } from '#imports'

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuth();
  const options = useRuntimeConfig().public.simpleAuth as ModuleOptions

  if (!auth.isLogged) return;

  if (to.path == options.homePage) return;

  return navigateTo(options.homePage);
})
