import { createState } from '@malolebrin/pinia-entity-store'
import type { EventType } from './types'

export function defaultEventState() {
  return {
    ...createState<EventType>(),
  }
}

export const eventState = defaultEventState()
