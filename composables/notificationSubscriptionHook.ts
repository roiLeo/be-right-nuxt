import type { NotificationSubscriptionType, NotificationTypeEnum } from '~~/store'
import { useNotificationsSubscriptionStore, useUiStore } from '~~/store'

export default function notificationSubscriptionHook() {
  const { $api, $toast } = useNuxtApp()
  const { IncLoading, DecLoading } = useUiStore()
  const notificationSubscriptionStore = useNotificationsSubscriptionStore()
  const { addMany, removeOne } = notificationSubscriptionStore

  async function fetchSubscriptions() {
    IncLoading()
    try {
      const { data } = await $api().get<NotificationSubscriptionType[]>('notificationSubscription')

      if (data && data.length > 0) {
        const missingSubscriptions = data.filter(item => !notificationSubscriptionStore.isAlreadyInStore(item.id))
        if (missingSubscriptions?.length > 0) {
          addMany(missingSubscriptions)
        }
      }
    } catch (error) {
      console.error(error)
    }
    DecLoading()
  }

  async function subscribe(type: NotificationTypeEnum) {
    IncLoading()
    try {
      const { data } = await $api().post<NotificationSubscriptionType>('notificationSubscription/suscbribe', { type })

      if (data) {
        addMany([data])
        $toast.success('Vous vous êtes abonné avec succès')
      }
    } catch (error) {
      console.error(error)
    }
    DecLoading()
  }

  async function unsubscribe(id: number) {
    IncLoading()
    try {
      const { success, data } = await $api().patch<{ success: boolean; message: string }>(`notificationSubscription/unsuscbribe/${id}`, {})

      if (success && data?.success) {
        $toast.success('Vous vous êtes désabonné avec succès')
        removeOne(id)
      }
    } catch (error) {
      console.error(error)
    }
    DecLoading()
  }

  return {
    fetchSubscriptions,
    subscribe,
    unsubscribe,
  }
}
