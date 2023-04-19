import { defineStore } from 'pinia'
import { createActions, createGetters } from '@malolebrin/pinia-entity-store'
import dayjs from 'dayjs'
import { useUserStore } from '../user'
import { notificationSubscriptionState, notificationsState } from './states'
import type { NotificationSubscriptionType, NotificationType } from './types'

export const useNotificationsSubscriptionStore = defineStore('notificationSubscription', {
  state: () => ({
    ...notificationSubscriptionState,
  }),

  getters: {
    ...createGetters<NotificationSubscriptionType>(notificationSubscriptionState),

    getForCurrentUser: state => {
      const userStore = useUserStore()
      return Object.values(state.entities.byId).filter(sub => sub.createdByUserId === userStore.getAuthUserId)
    },
  },

  actions: {
    ...createActions<NotificationSubscriptionType>(notificationSubscriptionState),

    addMany(notifSubs: NotificationSubscriptionType[]) {
      notifSubs.forEach(sub => {
        this.entities.byId[sub.id] = { ...sub, $isDirty: false }
        this.entities.allIds.push(sub.id)
      })
    },

    removeOne(id: number) {
      delete this.entities.byId[id]
      this.entities.allIds = this.entities.allIds.filter(entityId => entityId !== id)
    },
  },
})

export const useNotificationsStore = defineStore('notification', {
  state: () => ({
    ...notificationsState,
  }),

  getters: {
    ...createGetters<NotificationType>(notificationsState),

    getAllSorted: state => {
      return Object.values(state.entities.byId).sort((a, b) => {
        if (!a.readAt || !b.readAt) {
          return -1
        }
        return dayjs(a.readAt).isAfter(b.readAt) ? 1 : -1
      })
    },
  },

  actions: {
    ...createActions<NotificationType>(notificationsState),

    addMany(notifs: NotificationType[]) {
      notifs.forEach(notif => {
        this.entities.byId[notif.id] = { ...notif, $isDirty: false }
        this.entities.allIds.push(notif.id)
      })
    },

    updateOneNotification(id: number, data: Partial<NotificationType>) {
      if (this.entities.byId[id] !== null || this.entities.byId[id] !== undefined) {
        this.entities.byId[id] = {
          ...this.entities.byId[id],
          ...data,
        }
      }
    },

    updateManyNotifications(notifs: NotificationType[]) {
      notifs.forEach(notif => this.updateOneNotification(notif.id, notif))
    },
  },
})
