import type { RoleEnum } from './Roles'
import type { SubscriptionEnum } from '@/store/subscription/types'

export interface JWTDecodedType {
  email: string
  firstName: string
  lastName: string
  fullName: string
  roles: RoleEnum[]
  subscription: SubscriptionEnum
}

export interface ResetPasswordData {
  isSuccess: boolean
  message: string
}
