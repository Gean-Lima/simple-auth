import { defineNuxtModule, addPlugin, createResolver, installModule, addImports, addRouteMiddleware } from '@nuxt/kit'
import defu from 'defu'
import type { ModuleOptions } from './runtime/types/module'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxtjs/simpleauth',
    configKey: 'simpleAuth',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    await installModule('@pinia/nuxt')

    _nuxt.options.runtimeConfig.public.simpleAuth = defu(_nuxt.options.runtimeConfig.public.simpleAuth as ModuleOptions, _options)

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))

    addImports({
      name: 'useAuth',
      as: 'useAuth',
      from: resolver.resolve('./runtime/composables/useAuth'),
    })

    addRouteMiddleware({
      name: 'auth',
      path: resolver.resolve('./runtime/middleware/auth'),
    })

    addRouteMiddleware({
      name: 'guest',
      path: resolver.resolve('./runtime/middleware/guest'),
    })
  },
})
