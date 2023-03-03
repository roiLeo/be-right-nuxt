import type { AddressType, EmployeeType, EventType, FileType, SubscriptionEnum, SubscriptionType } from '@/types'
import type { BaseEntity } from '@/types/globals'
import type { RoleEnum } from '@/types/Roles'

export interface UserType extends BaseEntity {
  email: string
  token: string
  firstName: string
  lastName: string
  companyName: string | null
  siret: string
  apiKey: string
  roles: RoleEnum
  subscriptionLabel: SubscriptionEnum | null
  subscriptionId: number | null
  subscription?: SubscriptionType | null
  address?: AddressType | null
  addressId: number | null
  events?: EventType[]
  eventIds: number[]
  employee?: EmployeeType[]
  employeeIds: number[]
  files?: FileType[]
  filesIds: number[]
  profilePicture: string | null
  notificationSubscriptionIds: number[]
}

export type UserTypeOmitRelations = Omit<UserType, 'profilePicture' | 'createdAt' | 'updatedAt' | 'events' | 'employee' | 'files'>
export type UserFormType = Omit<UserType, 'id' | 'createdAt' | 'updatedAt' | 'events' | 'employee' | 'files'>

export enum UserSearchableFields {
  EMAIL = 'email',
  FISTNAME = 'firstName',
  LASTNAME = 'lastName',
  COMPANYNAME = 'companyName',
  SIRET = 'siret',
}

export type PhotographerCreatePayload = Pick<UserType, 'companyName' | 'firstName' | 'lastName' | 'email'>
