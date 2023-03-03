import type { AnswerType } from '../answer'
import type { BaseEntity, EventType, UserType } from '~~/types'

export enum NotificationTypeEnum {
  ANSWER_RESPONSE_ACCEPTED = 'ANSWER_RESPONSE_ACCEPTED',
  ANSWER_RESPONSE_REFUSED = 'ANSWER_RESPONSE_REFUSED',
  EVENT_CREATED = 'EVENT_CREATED',
  EVENT_COMPLETED = 'EVENT_COMPLETED',
  EVENT_CLOSED = 'EVENT_CLOSED',
}

export const NotificationTypeEnumArray = Object.values(NotificationTypeEnum)

export interface EventNotificationType extends BaseEntity {
  name: NotificationTypeEnum
  notifications?: NotificationType[]
  notificationIds: number[]
  event?: EventType
  eventId: number
  answer?: AnswerType
  answerId: number
}

export interface NotificationType extends BaseEntity {
  type: NotificationTypeEnum
  readAt: Date | null
  subscriber?: NotificationSubscriptionType
  subscriberId: number | null
  eventNotification?: EventNotificationType
  eventNotificationId: number
}

export interface NotificationSubscriptionType extends BaseEntity {
  type: NotificationTypeEnum
  notifications?: NotificationType[]
  notificationIds: number[]
  createdByUser?: UserType
  createdByUserId: number
}
