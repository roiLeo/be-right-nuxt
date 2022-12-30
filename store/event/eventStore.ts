import { defineStore } from 'pinia'
import { createActions, createGetters } from '@malolebrin/pinia-entity-store'
import { baseCreationForm, defaultEventState, eventState } from './state'
import type { BaseCreationFormType, EventType } from './types'
import { EntitiesEnum } from '@/types/globals'

export const useEventStore = defineStore(EntitiesEnum.EVENTS, {
  state: () => ({
    ...eventState,
  }),
  getters: {
    ...createGetters<EventType>(eventState),

    // bellow getters in this specific store
    getEventsByUserId: state => (userId: number) => Object.values(state.entities.byId).filter(event => event.createdByUser === userId),
    getCreationForm: state => state.creationForm,
  },
  actions: {
    ...createActions<EventType>(eventState),

    setCreationFormField<K extends keyof BaseCreationFormType>(field: K, value: BaseCreationFormType[K]) {
      this.creationForm[field] = value
    },
    setCreationForm(payload: BaseCreationFormType) {
      this.creationForm = payload
    },
    resetCreationForm() {
      this.creationForm = baseCreationForm
    },

    // actions common to all entities
    resetState() {
      this.$state = defaultEventState()
    },
    // bellow actions in this specific store
  },
})
