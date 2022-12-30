import type { RoleEnum } from './Roles'
import type { SubscriptionEnum } from '@/store/subscription/types'

export interface JWTDecodedType {
  firstName: string
  lastName: string
  fullName: string
  roles: RoleEnum[]
  subscription: SubscriptionEnum
}
