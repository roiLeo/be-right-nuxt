import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'
import type { NotificationType } from '~~/store'
import {
  NotificationTypeEnum,
  useNotificationsStore,
  // useNotificationsSubscriptionStore,
  useUiStore,
} from '~~/store'

dayjs.locale('fr')
dayjs.extend(relativeTime)
dayjs.extend(isBetween)

export default function notificationHook() {
  const { $api, $toFormat, $toast } = useNuxtApp()

  const { IncLoading, DecLoading } = useUiStore()
  const notificationStore = useNotificationsStore()
  const { addMany: addManyNotifications, updateMany } = notificationStore
  // const notificationSubscriptionStore = useNotificationsSubscriptionStore()

  async function fetchUserNotifications() {
    IncLoading()
    try {
      const { data } = await $api().get<NotificationType[]>('notifications')

      if (data && data.length > 0) {
        addManyNotifications(data)
      }
    } catch (error) {
      console.error(error)
    }
    DecLoading()
  }

  function getNotifTranslation({
    type,
    eventName,
  }: {
    type: NotificationTypeEnum
    eventName?: string
  }) {
    switch (type) {
      case NotificationTypeEnum.EVENT_CREATED:
        return eventName ? `Événement "${eventName}" créé` : 'Événement créé'

      case NotificationTypeEnum.EVENT_CLOSED:
        return eventName ? `Événement "${eventName}" terminé` : 'Événement terminé'

      case NotificationTypeEnum.EVENT_COMPLETED:
        return eventName ? `Événement "${eventName}" complété` : 'Événement complété'

      case NotificationTypeEnum.ANSWER_RESPONSE_ACCEPTED:
        return 'Réponse acceptée'

      case NotificationTypeEnum.ANSWER_RESPONSE_REFUSED:
        return 'Réponse refusée'

      default:
        break
    }
  }

  function getDateDisplayedNotification(notification: NotificationType) {
    const { readAt, createdAt } = notification
    const now = dayjs()
    const yesterday = now.subtract(1, 'day')

    if (!readAt) {
      if (dayjs(createdAt).isBetween(now, yesterday)) {
        return dayjs().to(dayjs(createdAt), true)
      }
      return `Créé le ${$toFormat(createdAt, 'DD MMMM YYYY')}`
    } else {
      if (dayjs(readAt).isBetween(now, yesterday)) {
        return dayjs().to(dayjs(readAt), true)
      }
      return `Lu le ${$toFormat(readAt, 'DD MMMM YYYY')}`
    }
  }

  async function patchAsRead(notificationIds: number[]) {
    IncLoading()
    try {
      if (notificationIds?.length) {
        const { success, data } = await $api().patch<NotificationType[]>(`notifications/readMany?ids=${notificationIds.join(',')}`, [])

        if (data?.length) {
          updateMany(data)
        }
        if (success) {
          $toast.success('Notifications marquées comme lues')
        }
      }
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
    DecLoading()
  }

  return {
    fetchUserNotifications,
    getNotifTranslation,
    getDateDisplayedNotification,
    patchAsRead,
  }
}
