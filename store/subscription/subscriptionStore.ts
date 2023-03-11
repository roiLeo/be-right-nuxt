import { defineStore } from 'pinia'
import { createActions, createGetters } from '@malolebrin/pinia-entity-store'
import { subscriptionState } from './state'
import type { SubscriptionType } from './types'

export const useSubscriptionStore = defineStore('subscription', {
  state: () => ({
    ...subscriptionState,
  }),

  getters: {
    ...createGetters<SubscriptionType>(subscriptionState),
  },

  actions: {
    ...createActions<SubscriptionType>(subscriptionState),

    addMany(subs: SubscriptionType[]) {
      subs.forEach(sub => {
        this.entities.byId[sub.id] = { ...sub, $isDirty: false }
        this.entities.allIds.push(sub.id)
      })
    },
  },
})
