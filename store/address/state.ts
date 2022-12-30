import { createState } from '@malolebrin/pinia-entity-store'
import type { AddressType, BaseCreationForm } from './types'

export const baseAddressCreationForm: BaseCreationForm = {
  addressLine: '',
  addressLine2: null,
  postalCode: '',
  city: '',
  subdivision: null, // Code ISO des régions (pour la France)
  subdivision2: null, // Code ISO des départements (pour la France)
  country: '',
}

export function defaultAddressState() {
  return {
    ...createState<AddressType>(),
    creationForm: baseAddressCreationForm,
  }
}

export const addressState = defaultAddressState()
