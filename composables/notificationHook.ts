import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'
import { hasOwnProperty, uniq } from '@antfu/utils'
import type { NotificationType } from '~~/store'
import {
  NotificationTypeEnum,
  useAnswerStore,
  useAuthStore,
  useEventStore,
  useNotificationsStore,
  useUiStore,
  useUserStore,
} from '~~/store'

dayjs.extend(relativeTime)
dayjs.extend(isBetween)

export default function notificationHook() {
  const { $api, $toFormat, $toast } = useNuxtApp()

  const { IncLoading, DecLoading } = useUiStore()
  const authStore = useAuthStore()
  const userStore = useUserStore()
  const eventStore = useEventStore()
  const answerStore = useAnswerStore()
  const notificationStore = useNotificationsStore()
  const { addMany: addManyNotifications, updateManyNotifications } = notificationStore

  const { fetchMany: fetchManyAnswers } = answerHook()
  const { fetchMany: fetchManyEvents } = eventHook()

  function areNotificationTypes(args: unknown[]): args is NotificationType[] {
    return args.every(arg =>
      hasOwnProperty(arg, 'type')
      && hasOwnProperty(arg, 'title')
      && hasOwnProperty(arg, 'subscriberId')
      && hasOwnProperty(arg, 'eventNotificationId'),
    )
  }

  async function fetchUserNotifications() {
    IncLoading()
    const { data } = await $api().get<NotificationType[]>('notifications')

    if (data && data.length > 0) {
      addManyNotifications(data)
    }
    DecLoading()
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
    if (notificationIds?.length) {
      const { success, data } = await $api().patch<NotificationType[]>(`notifications/readMany?ids=${notificationIds.join(',')}`, [])

      if (data?.length && areNotificationTypes(data)) {
        updateManyNotifications(data)
      }
      if (success) {
        $toast.success('Notifications marquées comme lues')
      }
    }
    DecLoading()
  }

  function getTranslationNotificationType(type: NotificationTypeEnum) {
    switch (type) {
      case NotificationTypeEnum.EVENT_CREATED:
        return {
          label: 'Création d\'événements',
          description: 'Vous recevrez des notifications de création d\'événements',
        }
      case NotificationTypeEnum.EVENT_COMPLETED:
        return {
          label: 'Événements complété',
          description: 'Vous recevrez des notifications lorsque tous les destinataires auront répondu à un événement',
        }
      case NotificationTypeEnum.EVENT_CLOSED:
        return {
          label: 'Événements terminé',
          description: 'Vous recevrez des notifications lorsque la date de fin de l\'événement sera passée',
        }
      case NotificationTypeEnum.ANSWER_RESPONSE_ACCEPTED:
        return {
          label: 'Droits à l\'image accepté',
          description: 'Vous recevrez des notifications lorsqu\'un destinataire aura accepté les droits à l\'image d\'un événement',
        }
      case NotificationTypeEnum.ANSWER_RESPONSE_REFUSED:
        return {
          label: 'Droits à l\'image refusé',
          description: 'Vous recevrez des notifications lorsqu\'un destinataire aura refusé les droits à l\'image d\'un événement',
        }
    }
  }

  async function fetchUserNotificationsAndRelations() {
    if (!authStore.isAuthUserAdmin && userStore.getAuthUser) {
      await fetchUserNotifications()
    }

    const notifications = notificationStore.getAllArray

    if (notifications?.length > 0) {
      const missingEventIds: number[] = []
      const missingAnswerIds: number[] = []

      notifications.forEach(notif => {
        if (notif.eventNotification) {
          const { eventId, answerId } = notif.eventNotification
          if (eventId && !eventStore.isAlreadyInStore(eventId)) {
            missingEventIds.push(eventId)
          }
          if (answerId && !answerStore.isAlreadyInStore(answerId)) {
            missingAnswerIds.push(answerId)
          }
        }
      })

      if (missingAnswerIds.length > 0) {
        await fetchManyAnswers(uniq(missingAnswerIds))
      }

      if (missingEventIds.length > 0) {
        await fetchManyEvents(uniq(missingEventIds))
      }
    }
  }

  return {
    areNotificationTypes,
    fetchUserNotifications,
    fetchUserNotificationsAndRelations,
    getDateDisplayedNotification,
    getTranslationNotificationType,
    patchAsRead,
  }
}
