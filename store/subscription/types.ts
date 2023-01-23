import type { PaymentType } from '../payment'
import type { BaseEntity } from '~~/types'

export enum SubscriptionEnum {
  PREMIUM = 'PREMIUM',
  MEDIUM = 'MEDIUM',
  BASIC = 'BASIC',
}

export enum SubscriptionTranslationEnum {
  PREMIUM = 'Premium',
  MEDIUM = 'Pro',
  BASIC = 'Essentiel',
}

export const subscriptionArray = Object.values(SubscriptionEnum)

export interface SubscriptionType extends BaseEntity {
  type: SubscriptionEnum
  expireAt: Date | null
  payment: PaymentType | null
  paymentId: number
}
