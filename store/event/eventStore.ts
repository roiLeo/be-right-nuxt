import { defineStore } from 'pinia'
import { createActions, createGetters } from '@malolebrin/pinia-entity-store'
import { useAnswerStore } from '../answer'
import { useAddressStore } from '../address'
import { baseCreationForm, defaultEventState, eventState } from './state'
import type { BaseCreationFormType, EventType } from './types'

export const useEventStore = defineStore('events', {
  state: () => ({
    ...eventState,
  }),
  getters: {
    ...createGetters<EventType>(eventState),

    // bellow getters in this specific store
    getEventsByUserId: state => (userId: number) => Object.values(state.entities.byId).filter(event => event.createdByUserId === userId),

    getCreationForm: state => state.creationForm,
  },
  actions: {
    ...createActions<EventType>(eventState),

    addMany(events: EventType[]) {
      events.forEach(event => {
        this.entities.byId[event.id] = { ...event, $isDirty: false }
        this.entities.allIds.push(event.id)
      })
    },

    deleteEventAndRelations(id: number) {
      const answerStore = useAnswerStore()
      const { deleteManyAnswers } = answerStore
      const { deleteOneAddress } = useAddressStore()

      const event = this.getOne(id)

      if (event.addressId) {
        deleteOneAddress(event.addressId)
      }

      delete this.entities.byId[id]
      this.entities.allIds = this.entities.allIds.filter(entityId => entityId !== id)

      const answers = answerStore.getManyByEventId(id)
      const answersIds = answers.map(answer => answer.id)

      if (answersIds?.length > 0) {
        deleteManyAnswers(answersIds)
      }
    },

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
