import type {
  AddressType,
  BaseEntity,
  EmployeeType,
  EventType,
  FileType,
  SubscriptionEnum,
  SubscriptionType,
  UserType,
} from '~~/types'

export interface Company extends BaseEntity {
  name: string | null
  siret: string | null

  subscriptionLabel: SubscriptionEnum | null
  subscriptionId: number | null
  subscription?: SubscriptionType | null

  address?: AddressType | null
  addressId: number | null

  events?: EventType[]
  eventIds: number[]

  employees?: EmployeeType[]
  employeeIds: number[]

  users?: UserType[]
  userIds: number[]

  owners?: UserType[]
  onwerIds: number[]

  files?: FileType[]
  filesIds: number[]
}