import type { NotificationSubscriptionType } from '../notification'
import type { Company } from '../company'
import type { BaseEntity } from '@/types/globals'
import type { RoleEnum } from '@/types/Roles'

export interface UserType extends BaseEntity {
  email: string
  token: string
  firstName: string
  lastName: string

  apiKey: string
  roles: RoleEnum

  profilePicture: string | null
  notificationSubscriptions?: NotificationSubscriptionType[]
  notificationSubscriptionIds: number[]

  companyId: number
  company?: Company | null
}

export type UserTypeOmitRelations = Omit<UserType, 'profilePicture' | 'createdAt' | 'updatedAt'>
export type UserFormType = Omit<UserType, 'id' | 'createdAt' | 'updatedAt'>

export enum UserSearchableFields {
  EMAIL = 'email',
  FISTNAME = 'firstName',
  LASTNAME = 'lastName',
}

export interface CreateNewUserPayload {
  email: string
  firstName: string
  lastName: string
  roles: RoleEnum
}
