import type { AddressTypeCreate, UserType } from '..'

export interface BaseEventFormType {
  name: string
  description?: string | null
  start: Date
  end: Date
  employeeIds: number[]
}

export type PhotographerCreatePayload = Pick<UserType, 'firstName' | 'lastName' | 'email'>

export interface BasePhotographerForm extends PhotographerCreatePayload {
  photographerId: number | null
  companyName: string | null
}

export type BaseAddressCreationForm = Omit<AddressTypeCreate, 'userId' | 'eventId' | 'employeeId'>

export enum FormEnum {
  ADDRESS_FORM = 'ADDRESS_FORM',
  PHOTOGRAPHER_FORM = 'PHOTOGRAPHER_FORM',
  EVENT_FORM = 'EVENT_FORM',
}
