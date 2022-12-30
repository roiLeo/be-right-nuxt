import { createState } from '@malolebrin/pinia-entity-store'
import type { PhotographerCreatePayload, UserType } from './types'

export const basePhotographerForm: PhotographerCreatePayload = {
  firstName: '',
  lastName: '',
  companyName: null,
  email: '',
}

export const userState = defaultUserState()

export function defaultUserState() {
  return {
    ...createState<UserType>(),
    photographerForm: basePhotographerForm,
  }
}
