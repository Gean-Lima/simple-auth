export default defineNuxtConfig({
  modules: ['../src/module'],
  authJWT: {
    loginPage: '/',
    homePage: '/home',
    baseUrl: 'http://localhost:8000/api',
    login: {
      url: '/login',
      method: 'POST',
      token: {
        field: 'access_token',
        field_expires: 'expires_in'
      },
    },
    logout: {
      url: '/auth/me',
      method: 'POST'
    },
    refresh: {
      url: '/auth/refresh',
      method: 'POST',
      token: {
        field: 'access_token',
        field_expires: 'expires_in'
      },
    },
    me: {
      url: '/auth/me',
      method: 'POST'
    }
  },
  devtools: { enabled: true },
})
