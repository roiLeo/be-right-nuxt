import { createActions, createGetters } from '@malolebrin/pinia-entity-store'
import { defineStore } from 'pinia'
import { newsletterState } from './state'
import type { NewsletterType } from './types'
import { EntitiesEnum } from '@/types'

export const useNewsletterStore = defineStore(EntitiesEnum.NEWSLETTER, {
  state: () => ({
    ...newsletterState,
  }),
  actions: {
    ...createActions<NewsletterType>(newsletterState),
  },
  getters: {
    ...createGetters<NewsletterType>(newsletterState),
  },
})
