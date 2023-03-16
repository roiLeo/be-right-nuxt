import { createState } from '@malolebrin/pinia-entity-store'
import type { AddressType } from './types'

export function defaultAddressState() {
  return {
    ...createState<AddressType>(),
  }
}

export const addressState = defaultAddressState()
