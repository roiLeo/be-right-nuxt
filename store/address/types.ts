import type { BaseEntity, EmployeeType, EventType, UserType } from '@/types'

export interface AddressType extends BaseEntity {
  addressLine: string
  addressLine2?: string | null
  postalCode: string
  city: string
  subdivision?: string | null // Code ISO des régions (pour la France)
  subdivision2?: string | null // Code ISO des départements (pour la France)
  country: string
  lat?: number
  lng?: number
  userId?: UserType | number
  eventId?: EventType | number
  employeeId?: EmployeeType | number
}

export interface AddressPostPayload {
  address: AddressTypeCreate
  eventId?: number | null
  userId?: number | null
  employeeId?: number | null
}

export type AddressTypeCreate = Omit<AddressType, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt' | 'lat' | 'lng'>
export type BaseCreationForm = Omit<AddressTypeCreate, 'userId' | 'eventId' | 'employeeId'>
