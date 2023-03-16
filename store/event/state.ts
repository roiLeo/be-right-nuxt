import { createState } from '@malolebrin/pinia-entity-store'
import type { BaseCreationFormType, EventType } from './types'

export const baseCreationForm: BaseCreationFormType = {
  name: '',
  description: '',
  start: new Date(),
  end: new Date(),
  employeeIds: [],
}

export function defaultEventState() {
  return {
    ...createState<EventType>(),
    creationForm: baseCreationForm,
  }
}

export const eventState = defaultEventState()
