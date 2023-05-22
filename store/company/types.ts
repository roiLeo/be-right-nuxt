import type { Group } from '../group'
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

  groups?: Group[]
  groupIds: number[]

  employees?: EmployeeType[]
  employeeIds: number[]

  users?: UserType[]
  userIds: number[]

  files?: FileType[]
  filesIds: number[]
}

export interface MissingInfos {
  label: string
  link: {
    name: any
  }
}
