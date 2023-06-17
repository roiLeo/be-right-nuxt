import { hasOwnProperty } from '@antfu/utils'
import type { NotificationSubscriptionType, NotificationTypeEnum } from '~~/store'
import { useNotificationsSubscriptionStore, useUiStore } from '~~/store'

export default function notificationSubscriptionHook() {
  const { $api, $toast } = useNuxtApp()
  const { IncLoading, DecLoading } = useUiStore()
  const notificationSubscriptionStore = useNotificationsSubscriptionStore()
  const { addMany, removeOne } = notificationSubscriptionStore

  function isNotifSubscription(arg: unknown): arg is NotificationSubscriptionType {
    return hasOwnProperty(arg, 'type')
      && hasOwnProperty(arg, 'createdByUserId')
      && hasOwnProperty(arg, 'notificationIds')
  }

  function areNotifSubscriptions(args: unknown[]): args is NotificationSubscriptionType[] {
    return args.every(arg => isNotifSubscription(arg))
  }

  async function fetchSubscriptions() {
    IncLoading()
    const { data } = await $api().get<NotificationSubscriptionType[]>('notificationSubscription')

    if (data && data.length > 0 && areNotifSubscriptions(data)) {
      const missingSubscriptions = data.filter(item => !notificationSubscriptionStore.isAlreadyInStore(item.id))
      if (missingSubscriptions?.length > 0) {
        addMany(missingSubscriptions)
      }
    }
    DecLoading()
  }

  async function subscribe(type: NotificationTypeEnum) {
    IncLoading()
    const { data } = await $api().post<NotificationSubscriptionType>('notificationSubscription/suscbribe', { type })

    if (data && isNotifSubscription(data)) {
      addMany([data])
      $toast.success('Vous vous êtes abonné avec succès')
    }
    DecLoading()
  }

  async function unsubscribe(id: number) {
    IncLoading()
    const { success, data } = await $api().patch<{ success: boolean; message: string }>(`notificationSubscription/unsuscbribe/${id}`, {})

    if (success && data?.success) {
      $toast.success('Vous vous êtes désabonné avec succès')
      removeOne(id)
    }
    DecLoading()
  }

  return {
    fetchSubscriptions,
    subscribe,
    unsubscribe,
  }
}
