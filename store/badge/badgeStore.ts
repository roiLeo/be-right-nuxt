import { defineStore } from 'pinia'
import { createActions, createGetters } from '@malolebrin/pinia-entity-store'
import { badgeState, defaultBadgeState } from './state'
import type { Badge } from './types'

export const useBadgeStore = defineStore('badge', {
  state: () => ({
    ...badgeState,
  }),
  getters: {
    ...createGetters<Badge>(badgeState),
  },
  actions: {
    ...createActions<Badge>(badgeState),

    addOne(badge: Badge) {
      this.entities.byId[badge.id] = { ...badge, $isDirty: false }
      this.entities.allIds.push(badge.id)
    },

    addMany(badges: Badge[]) {
      badges.forEach(badge => {
        this.entities.byId[badge.id] = { ...badge, $isDirty: false }
        this.entities.allIds.push(badge.id)
      })
    },

    updateOneBadge(id: number, data: Partial<Badge>) {
      if (this.entities.byId[id] !== null || this.entities.byId[id] !== undefined) {
        this.entities.byId[id] = {
          ...this.entities.byId[id],
          ...data,
        }
      }
    },

    resetState() {
      this.$state = defaultBadgeState()
    },

    deleteOneBadge(id: number) {
      delete this.entities.byId[id]
      this.entities.allIds = this.entities.allIds.filter(entityId => entityId !== id)
    },
  },
})
