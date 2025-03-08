import { useNuxtApp } from '#app'

export const useAuth = () => {
  const nuxtApp = useNuxtApp()
  return nuxtApp.$auth
}
