import { createState } from '@malolebrin/pinia-entity-store'
import type { SubscriptionType } from './types'

export function defaultSubscriptionState() {
  return {
    ...createState<SubscriptionType>(),
  }
}

export const subscriptionState = defaultSubscriptionState()
