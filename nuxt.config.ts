import Components from 'unplugin-vue-components/vite'
import { HeadlessUiResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer'
import { type PluginOption } from 'vite'

export default defineNuxtConfig({
  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'fr',
      },
    },
    layoutTransition: {
      mode: 'out-in',
      name: 'layout',
    },
  },

  runtimeConfig: {
    public: {
      siteUrl: 'https://be-right.co/',
      siteName: 'Be Right',
      siteDescription: 'Gérez enfin le droit à l\'image de vos clients facilement !',
      language: 'fr_FR',
    },
  },

  // schemaOrg: {
  //   host: 'https://be-right.co',
  // },

  extends: [
    'nuxt-seo-kit',
  ],

  typescript: {
    strict: true,
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    'nuxt-headlessui',
    '@sidebase/nuxt-pdf',
    '@nuxtjs/eslint-module',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-typed-router',
    '@nuxtjs/html-validator',
    'nuxt-schema-org',
  ],

  build: {
    transpile: [
      'vue-toastification',
      'v-calendar',
    ],
  },

  plugins: [
    { src: '~/plugins/serverInit.server.ts', ssr: true, mode: 'server' },
  ],

  vite: {
    plugins: [
      Components({
        resolvers: [
          HeadlessUiResolver({}),
          name => {
            if (name.includes('IconSolid')) {
              const realName = name.split('Solid')[0]
              return `@heroicons/vue/24/solid/esm/${realName}`
            }
            if (name.includes('IconOutline')) {
              const realName = name.split('Outline')[0]
              return `@heroicons/vue/24/outline/esm/${realName}`
            }
          },
        ],
        include: [/\.vue$/, /\.vue\?vue/],
        extensions: ['vue'],
      }),

      visualizer() as PluginOption,
    ],
  },

})
