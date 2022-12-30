import { createState } from '@malolebrin/pinia-entity-store'
import type { NewsletterType } from './types'

export const newsletterState = createState<NewsletterType>()

export function defaultNewsletterState() {
  return createState<NewsletterType>()
}
