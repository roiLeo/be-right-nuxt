import type { NotificationType } from '~~/store'
import { useNotificationsStore, useNotificationsSubscriptionStore, useUiStore } from '~~/store'

export default function notificationHook() {
  const { $toast, $api } = useNuxtApp()

  const { IncLoading, DecLoading } = useUiStore()
  const notificationStore = useNotificationsStore()
  const { addMany: addManyNotifications } = notificationStore
  const notificationSubscriptionStore = useNotificationsSubscriptionStore()

  async function fetchUserNotifications() {
    IncLoading()
    try {
      const { data } = await $api().get<NotificationType[]>('notifications')

      if (data && data.length > 0) {
        console.log(data, '<==== data')
        addManyNotifications(data)
      }
    } catch (error) {
      console.error(error)
    }
    DecLoading()
  }

  return {
    fetchUserNotifications,
  }
}
