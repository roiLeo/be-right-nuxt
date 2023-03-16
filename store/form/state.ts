import type { BaseAddressCreationForm, BaseEventFormType, BasePhotographerForm } from './types'

export const baseEventCreationForm: BaseEventFormType = {
  name: '',
  description: '',
  start: new Date(),
  end: new Date(),
  employeeIds: [],
}

export const basePhotographerForm: BasePhotographerForm = {
  firstName: '',
  lastName: '',
  companyName: null,
  email: '',
  photographerId: null,
}

export const baseAddressCreationForm: BaseAddressCreationForm = {
  addressLine: '',
  addressLine2: null,
  postalCode: '',
  city: '',
  subdivision: null, // Code ISO des régions (pour la France)
  subdivision2: null, // Code ISO des départements (pour la France)
  country: '',
}

export function createForm<T>(form: T) {
  return {
    ...form,
    isDirty: false,
  }
}

export function defaultFormState() {
  return {
    addressForm: createForm(baseAddressCreationForm),
    photographerForm: createForm(basePhotographerForm),
    eventform: createForm(baseEventCreationForm),
  }
}

export const formState = defaultFormState()
