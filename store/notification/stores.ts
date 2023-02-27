import { defineStore } from 'pinia'
import { createActions, createGetters } from '@malolebrin/pinia-entity-store'
import { notificationSubscriptionState, notificationsState } from './states'
import type { NotificationSubscriptionType, NotificationType } from './types'

export const useNotificationsSubscriptionStore = defineStore('notificationSubscription', {
  state: () => ({
    ...notificationSubscriptionState,
  }),

  getters: {
    ...createGetters<NotificationSubscriptionType>(notificationSubscriptionState),
  },

  actions: {
    ...createActions<NotificationSubscriptionType>(notificationSubscriptionState),
  },
})

export const useNotificationsStore = defineStore('notification', {
  state: () => ({
    ...notificationsState,
  }),

  getters: {
    ...createGetters<NotificationType>(notificationsState),
  },

  actions: {
    ...createActions<NotificationType>(notificationsState),
  },
})
