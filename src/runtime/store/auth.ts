import { ref } from 'vue'
import { addMonths } from 'date-fns'
import axios, { type AxiosResponse } from 'axios'
import { defineStore } from 'pinia'
import { useRuntimeConfig, useCookie, useRouter, refreshCookie, navigateTo } from '#app'
import type { AuthData, ExtractConfig } from '../types/auth'
import type { ModuleOptions } from '../types/module'

export const useAuthStore = defineStore('auth', () => {
  const expiration = addMonths(new Date(), 3)
  const dataExpiration = {
    maxAge: expiration.getTime() / 1000,
    expires: expiration,
  }
  const options = useRuntimeConfig().public.simpleAuth as ModuleOptions
  const tokenCookie = useCookie('_auth__token', dataExpiration)
  const tokenExpiresCookie = useCookie('_auth__token_expires', dataExpiration)

  type UserDefinedType = ExtractConfig<typeof options.data.dataType>;

  const isLogged = ref(false)
  const token = ref<string | null>(null)
  const expires = ref<number | null>(null)
  const user = ref<UserDefinedType | null>(null)

  async function _setup() {
    if (!tokenCookie.value || !tokenExpiresCookie.value) return

    setToken(tokenCookie.value, Number.parseInt(tokenExpiresCookie.value))

    if (new Date().getTime() > Number.parseInt(tokenExpiresCookie.value)) await refresh()

    await me()
  }

  async function login(data: AuthData, redirect = true) {
    try {
      const response = await axios.request({
        url: options.baseUrl ? `${options.baseUrl}${options.login.url}` : options.login.url,
        method: options.login.method,
        data: data,
        headers: options.login.headers ?? {},
      })

      const { token, expires } = getValuesByResponse(response)

      setTokenCookie(token, expires)
      setToken(token, expires)

      await me()

      if (redirect) redirectHome()
    }
    catch (e) {
      throw e;
    }
  }

  async function logout(redirect = true) {
    try {
      await axios.request({
        url: options.baseUrl ? `${options.baseUrl}${options.logout.url}` : options.logout.url,
        method: options.logout.method,
        headers: options.logout.headers ?? {},
      })

      clear()

      if (redirect) redirectLogin()
    }
    catch (e) {
      throw e
    }
  }

  async function refresh() {
    try {
      const response = await axios.request({
        url: options.baseUrl ? `${options.baseUrl}${options.refresh.url}` : options.refresh.url,
        method: options.refresh.method,
        headers: options.refresh.headers ?? {},
      })

      const { token, expires } = getValuesByResponse(response)

      setTokenCookie(token, expires)
      setToken(token, expires)
    }
    catch (e) {
      clear()
      throw e
    }
  }

  async function me() {
    try {
      const res = await axios.request({
        url: options.baseUrl ? `${options.baseUrl}${options.me.url}` : options.me.url,
        method: options.me.method,
        headers: options.me.headers ?? {},
      })

      if (options.me.userField) {
        if (!Object.keys(res.data).includes(options.me.userField))
          throw new Error('Error getting user, field not found')

        user.value = res.data[options.me.userField]
        return
      }

      user.value = res.data
    }
    catch (e) {
      clear()
      throw e
    }
  }

  function setToken(userToken: string, userExpires: number) {
    isLogged.value = true
    token.value = userToken
    expires.value = userExpires

    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  function setTokenCookie(userToken: string, tokenExpires: number) {
    tokenCookie.value = userToken
    tokenExpiresCookie.value = tokenExpires?.toString()

    refreshCookie('_auth__token')
    refreshCookie('_auth__token_expires')
  }

  function clear() {
    tokenCookie.value = null
    tokenExpiresCookie.value = null

    refreshCookie('_auth__token')
    refreshCookie('_auth__token_expires')

    isLogged.value = false
    token.value = null
    expires.value = null

    axios.defaults.headers.common['Authorization'] = undefined
  }

  function redirectHome() {
    navigateTo(options.homePage)
  }

  function redirectLogin() {
    navigateTo(options.loginPage)
  }

  function getValuesByResponse(res: AxiosResponse) {
    const dataKeys = Object.keys(res.data)
    const tokenField = options.login.token.field
    const tokenFieldExpires = options.login.token.field_expires

    if (!dataKeys.includes(tokenField) || !dataKeys.includes(tokenFieldExpires))
      throw new Error('Error getting token, field not found')

    const token = res.data[tokenField]
    const expires = new Date().getTime() + (Number.parseInt(res.data[tokenFieldExpires]) * 1000)

    return { token, expires }
  }

  return {
    isLogged,
    token,
    expires,
    user,
    _setup,
    login,
    logout,
    refresh,
    me,
    clear,
    setToken,
    setTokenCookie
  }
})
