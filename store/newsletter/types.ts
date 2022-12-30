import type { BaseEntity } from '@/types'

export interface NewsletterType extends BaseEntity {
  email: string
  firstName: string | null
  lastName: string | null
  companyName: string | null
}
