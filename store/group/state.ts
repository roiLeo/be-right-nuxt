import { createState } from '@malolebrin/pinia-entity-store'
import type { Group } from './types'

export function defaultGroupState() {
  return {
    ...createState<Group>(),
  }
}

export const groupState = defaultGroupState()
