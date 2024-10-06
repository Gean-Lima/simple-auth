<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: Simple Auth
- Package name: @geanlima/simpleauth
- Description: A simple authentication module using token
-->

# Simple Auth

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A simple authentication module using token

Designed to be used with [tymondesigns/jwt-auth](https://github.com/tymondesigns/jwt-auth)

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/@geanlima/simpleauth?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->
- ⛰ &nbsp;Simple integration
- 🔐 &nbsp;Middleware
- 🔗 &nbsp;[Axios](https://axios-http.com/) and [Pinia](https://pinia.vuejs.org/)

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add @geanlima/simpleauth
```

That's it! You can now use Simple Auth in your Nuxt app ✨

## Use
```javascript
export default defineNuxtConfig({
  modules: ['@geanlima/simpleauth'],
  simpleAuth: {
    loginPage: '/', // Authentication page
    homePage: '/home', // Authenticated User Page
    baseUrl: 'http://localhost:8000/api', // API base URL, if not passed it will only use the URL field
    login: {
      url: '/login',
      method: 'POST',
      token: {
        field: 'access_token',
        field_expires: 'expires_in', // Time in seconds that the token is valid
      },
    },
    logout: {
      url: '/auth/me',
      method: 'POST',
    },
    refresh: {
      url: '/auth/refresh',
      method: 'POST',
      token: {
        field: 'access_token',
        field_expires: 'expires_in',
      },
    },
    me: {
      url: '/auth/me',
      method: 'POST',
    },
  }
})

```


## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@geanlima/simpleauth/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@geanlima/simpleauth

[npm-downloads-src]: https://img.shields.io/npm/dm/@geanlima/simpleauth.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npmjs.com/package/@geanlima/simpleauth

[license-src]: https://img.shields.io/npm/l/@geanlima/simpleauth.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/@geanlima/simpleauth

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
