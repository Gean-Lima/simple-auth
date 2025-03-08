import { defineStore } from 'pinia'
import axios, { type AxiosResponse } from 'axios'
import { useRuntimeConfig, useCookie, useRouter, refreshCookie, type CookieOptions } from '#app'
import { ref } from 'vue'
import { addMonths } from 'date-fns'

export const useAuthStore = defineStore('auth', () => {
  const expiration = addMonths(new Date(), 3);
  const dataExpiration = {
    maxAge: expiration.getTime() / 1000,
    expires: expiration,
    readonly: false,
    watch: true,
  };
  const options = useRuntimeConfig().public.simpleAuth
  const tokenCookie = useCookie('_auth__token', dataExpiration)
  const tokenExpiresCookie = useCookie('_auth__token_expires', dataExpiration)

  const isLogged = ref(false)
  const token = ref<string | null>(null)
  const expires = ref<number | null>(null)
  const user = ref<any>(null)

  async function _setup() {
    if (!tokenCookie.value || !tokenExpiresCookie.value) return

    setToken(tokenCookie.value, parseInt(tokenExpiresCookie.value))

    if (new Date().getTime() > parseInt(tokenExpiresCookie.value)) await refresh()

    await me()
  }

  function login(data: unknown, redirectHome = true): Promise<unknown> {
    return new Promise((resolve, reject) => {
      axios.request({
        url: options.baseUrl ? `${options.baseUrl}${options.login.url}` : options.login.url,
        method: options.login.method,
        data: data,
        headers: options.login.headers ?? {},
      })
        .then(async (res) => {
          let { token, expires } = getValuesByResponse(res)

          setTokenCookie(token, expires)
          setToken(token, expires)

          await me()

          resolve(res.data)

          if (redirectHome) redirect()
        })
        .catch(err => reject(err))
    })
  }

  function logout(redirectLogin = true): Promise<unknown> {
    return new Promise((_, reject) => {
      axios.request({
        url: options.baseUrl ? `${options.baseUrl}${options.logout.url}` : options.logout.url,
        method: options.logout.method,
        headers: options.logout.headers ?? {},
      })
        .then(() => {
          clear()

          if (redirectLogin) redirect()
        })
        .catch(err => reject(err))
    })
  }

  async function refresh() {
    try {
      const res = await axios.request({
        url: options.baseUrl ? `${options.baseUrl}${options.refresh.url}` : options.refresh.url,
        method: options.refresh.method,
        headers: options.refresh.headers ?? {},
      })

      let { token, expires } = getValuesByResponse(res)

      setTokenCookie(token, expires)
      setToken(token, expires)
    }
    catch (e: any) {
      console.error(e.message)
      clear()
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
    catch (e: any) {
      console.error(e.message)
      clear()
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
  }

  function redirect() {
    if (isLogged.value) {
      useRouter().push(options.homePage)
      return;
    }

    useRouter().push(options.loginPage)
  }

  function getValuesByResponse(res: AxiosResponse) {
    const dataKeys = Object.keys(res.data)
    const tokenField = options.login.token.field
    const tokenFieldExpires = options.login.token.field_expires

    if (!dataKeys.includes(tokenField) || !dataKeys.includes(tokenFieldExpires))
      throw new Error('Error getting token, field not found')

    let token = res.data[tokenField]
    let expires = new Date().getTime() + (parseInt(res.data[tokenFieldExpires]) * 1000)

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
    setTokenCookie,
    redirect
  }
})
