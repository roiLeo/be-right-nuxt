import type { SubscriptionType } from '../subscription/types'
import type { BaseEntity } from '~~/types'

export interface PaymentType extends BaseEntity {
  amount: number
  currency: string
  submittedAt: Date | null
  executedAt: Date | null
  subscription?: SubscriptionType
  subscriptionId: number
}

export enum PaymentStatusEnum {
  PAYMENT_STATUS_CREATED = 'PAYMENT_STATUS_CREATED',
  PAYMENT_STATUS_SUBMITTED = 'PAYMENT_STATUS_SUBMITTED',
  PAYMENT_STATUS_PAID = 'PAYMENT_STATUS_PAID',
  PAYMENT_STATUS_REJECTED = 'PAYMENT_STATUS_REJECTED',
}
