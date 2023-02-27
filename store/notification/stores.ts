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

    addMany(notifSubs: NotificationSubscriptionType[]) {
      notifSubs.forEach(sub => {
        this.entities.byId[sub.id] = { ...sub, $isDirty: false }
        this.entities.allIds.push(sub.id)
      })
    },
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

    addMany(notifs: NotificationType[]) {
      notifs.forEach(notif => {
        this.entities.byId[notif.id] = { ...notif, $isDirty: false }
        this.entities.allIds.push(notif.id)
      })
    },
  },
})
