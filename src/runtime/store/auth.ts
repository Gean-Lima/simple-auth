import { defineStore } from 'pinia'
import axios from 'axios'
import { useRuntimeConfig, useCookie, useRouter } from '#app'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLogged: false as boolean,
    token: null as string | null,
    expires: null as Date | null,
    user: null as unknown | null,
  }),
  actions: {
    async _setup() {
      const tokenCookie = useCookie('_auth__token')
      const tokenExpiresCookie = useCookie('_auth__token_expires')

      if (!tokenCookie.value || !tokenExpiresCookie.value) return

      this.setToken(tokenCookie.value, tokenExpiresCookie.value, false)

      if (new Date().getTime() > tokenExpiresCookie.value) return await this.refresh()

      await this.me()
    },

    login(data: unknown, autoRedirect = true): Promise<unknown> {
      const options = useRuntimeConfig().public.simpleAuth

      return new Promise((resolve, reject) => {
        axios.request({
          url: options.baseUrl ? `${options.baseUrl}${options.login.url}` : options.login.url,
          method: options.login.method,
          data: data,
          headers: options.login.headers ?? {},
        })
          .then(async (res) => {
            const dataKeys = Object.keys(res.data)
            const tokenField = options.login.token.field
            const tokenFieldExpires = options.login.token.field_expires

            if (!dataKeys.includes(tokenField) || !dataKeys.includes(tokenFieldExpires))
              throw new Error('Error getting token, field not found')

            this.setToken(res.data[tokenField], res.data[tokenFieldExpires])

            await this.me()

            if (autoRedirect) {
              useRouter().push(options.homePage)
              return
            }

            resolve(res.data)
          })
          .catch(err => reject(err))
      })
    },

    logout(autoRedirect = true): Promise<unknown> {
      const options = useRuntimeConfig().public.simpleAuth

      return new Promise((_, reject) => {
        axios.request({
          url: options.baseUrl ? `${options.baseUrl}${options.logout.url}` : options.logout.url,
          method: options.logout.method,
          headers: options.logout.headers ?? {},
        })
          .then(() => this.clearAndRedirect(autoRedirect))
          .catch(err => reject(err))
      })
    },

    async refresh() {
      const options = useRuntimeConfig().public.simpleAuth

      try {
        const res = await axios.request({
          url: options.baseUrl ? `${options.baseUrl}${options.refresh.url}` : options.refresh.url,
          method: options.refresh.method,
          headers: options.refresh.headers ?? {},
        })

        const dataKeys = Object.keys(res.data)
        const tokenField = options.refresh.token.field
        const tokenFieldExpires = options.refresh.token.field_expires

        if (!dataKeys.includes(tokenField) || !dataKeys.includes(tokenFieldExpires))
          throw new Error('Error getting token, field not found')

        this.setToken(res.data[tokenField], res.data[tokenFieldExpires])
      }
      catch {
        this.clearAndRedirect()
      }
    },

    async me() {
      const options = useRuntimeConfig().public.simpleAuth

      try {
        const res = await axios.request({
          url: options.baseUrl ? `${options.baseUrl}${options.me.url}` : options.me.url,
          method: options.me.method,
          headers: options.me.headers ?? {},
        })

        if (options.me.userField) {
          if (!Object.keys(res.data).includes(options.me.userField))
            throw new Error('Error getting user, field not found')

          this.user = res.data[options.me.userField]
          return
        }

        this.user = res.data
      }
      catch {
        this.clearAndRedirect()
      }
    },

    clearAndRedirect(redirect = true) {
      const options = useRuntimeConfig().public.simpleAuth

      const tokenCookie = useCookie('_auth__token')
      const tokenExpiresCookie = useCookie('_auth__token_expires')

      tokenCookie.value = null
      tokenExpiresCookie.value = null

      this.isLogged = false
      this.token = null
      this.expires = null

      if (redirect) useRouter().push(options.loginPage)
    },

    setToken(token: string, expires: number, cookie = true) {
      this.isLogged = true
      this.token = token
      this.expires = new Date().getTime() + (expires * 1000)

      if (cookie) {
        const cookieOptions = {
          expires: new Date(new Date().getTime() + (604800 * 1000)),
        }

        const tokenCookie = useCookie('_auth__token', cookieOptions)
        const tokenExpiresCookie = useCookie('_auth__token_expires', cookieOptions)

        tokenCookie.value = this.token
        tokenExpiresCookie.value = this.expires
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
    },
  },
})
