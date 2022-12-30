import type { EmployeeType, EventType, FileType, SubscriptionEnum } from '@/types'
import type { BaseEntity } from '@/types/globals'
import type { RoleEnum } from '@/types/Roles'

export interface UserType extends BaseEntity {
  email: string
  token: string
  firstName: string
  lastName: string
  companyName?: string | null
  siret: string
  apiKey: string
  roles: RoleEnum
  subscription: SubscriptionEnum
  events?: number[] | EventType[]
  employee?: number[] | EmployeeType[]
  files?: number[] | FileType[]
  profilePicture?: string | null
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
