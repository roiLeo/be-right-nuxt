import { createState } from '@malolebrin/pinia-entity-store'
import type { Badge } from './types'

export function defaultBadgeState() {
  return {
    ...createState<Badge>(),
  }
}

export const badgeState = defaultBadgeState()
