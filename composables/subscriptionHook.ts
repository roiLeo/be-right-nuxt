import type { SubscriptionEnum } from '@/types'
import { SubscriptionTranslationEnum } from '@/types'

export default function subscriptionHook() {
  function getSuscriptionTranslation(type: SubscriptionEnum) {
    return SubscriptionTranslationEnum[type]
  }

  return {
    getSuscriptionTranslation,
  }
}
