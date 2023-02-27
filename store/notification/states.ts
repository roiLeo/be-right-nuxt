import { createState } from '@malolebrin/pinia-entity-store'
import type { NotificationSubscriptionType, NotificationType } from './types'

export function defaultNotificationsState() {
  return {
    ...createState<NotificationType>(),
  }
}

export const notificationsState = defaultNotificationsState()

export function defaultNotificationSubscriptionsState() {
  return {
    ...createState<NotificationSubscriptionType>(),
  }
}

export const notificationSubscriptionState = defaultNotificationSubscriptionsState()
