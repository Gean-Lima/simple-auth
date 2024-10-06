import { defineNuxtModule, addPlugin, createResolver, installModule, addImports, addRouteMiddleware } from '@nuxt/kit'
import defu from 'defu'

// Module options TypeScript interface definition
export interface ModuleOptions {
  loginPage: string,
  homePage: string,
  baseUrl?: string,
  login: {
    url: string,
    method: 'POST' | 'GET',
    token: {
      field: string,
      field_expires: string
    },
    headers?: any
  }
  logout: {
    url: string,
    method: 'POST' | 'GET' | 'DELETE',
    headers?: any
  },
  refresh: {
    url: string,
    method: 'POST' | 'GET' | 'PUT',
    token: {
      field: string,
      field_expires: string
    },
    headers?: any
  },
  me: {
    url: string,
    method: 'POST' | 'GET',
    userField?: string,
    headers?: any
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxtjs/auth-jwt',
    configKey: 'authJWT',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    await installModule('@pinia/nuxt');

    _nuxt.options.runtimeConfig.public.authJWT = defu(_nuxt.options.runtimeConfig.public.authJWT, _options);

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))
    
    addImports({
      name: 'useAuth',
      as: 'useAuth',
      from: resolver.resolve('./runtime/composables/useAuth')
    });
    
    addRouteMiddleware({
      name: 'auth',
      path: resolver.resolve('./runtime/middleware/auth')
    });

    addRouteMiddleware({
      name: 'guest',
      path: resolver.resolve('./runtime/middleware/guest')
    });
  },
})
