import { createState } from '@malolebrin/pinia-entity-store'
import type { BasePhotographerForm, UserType } from './types'

export const basePhotographerForm: BasePhotographerForm = {
  firstName: '',
  lastName: '',
  companyName: null,
  email: '',
  photographerId: null,
}

export const userState = defaultUserState()

export function defaultUserState() {
  return {
    ...createState<UserType>(),
    photographerForm: basePhotographerForm,
  }
}
