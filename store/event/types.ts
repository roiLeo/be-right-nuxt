import type { State } from '@malolebrin/pinia-entity-store'
import type { Company } from '../company'
import type {
  AddressType,
  AddressTypeCreate,
  BaseEntity,
  FileType,
  UserType,
} from '@/types'

export interface IEvent extends BaseEntity {
  name: string
  description: string | null
  start: Date
  end: Date
  status: EventStatusEnum
  signatureCount: number
  totalSignatureNeeded: number
  company?: Company
  companyId: number
  partner?: UserType | null
  partnerId: number | null
}

export interface EventType extends IEvent {
  files?: FileType[]
  filesIds: number[]
  addressId: number | null
  address?: AddressType | null
}

export type EventTypeCreate = Omit<IEvent, 'status' | 'id' | 'createdAt' | 'deletedAt' | 'updatedAt' | 'totalSignatureNeeded' | 'signatureCount' | 'files' | 'address'> & {
  photographerId: number
}
export interface EventCreatePayload {
  event: EventTypeCreate
  address?: AddressTypeCreate
  photographerId?: number
}

export enum EventSearchableFields {
  NAME = 'name',
  ADDRESS = 'address',
  CITY = 'city',
}

export enum EventStatusEnum {
  CREATE = 'CREATE',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CLOSED = 'CLOSED',
}

export const eventStatusArray = Object.values(EventStatusEnum)

export enum getEventStatusTranslationEnum {
  CREATE = 'à venir',
  PENDING = 'en cours',
  COMPLETED = 'complété',
  CLOSED = 'terminé',
}

export interface EventState extends State<EventType> { }
