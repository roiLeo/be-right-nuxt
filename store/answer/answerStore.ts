import { defineStore } from 'pinia'
import { createActions, createGetters } from '@malolebrin/pinia-entity-store'
import { answerState, defaultAnswerState } from './state'
import type { AnswerType } from './types'

export const useAnswerStore = defineStore('answers', {
  state: () => ({
    ...answerState,
  }),

  getters: {
    // getters common to all entities
    ...createGetters<AnswerType>(answerState),

    // bellow getters in this specific store
    getManyByEventId(state) {
      return (eventId: number) => Object.values(state.entities.byId).filter(answer => answer.eventId === eventId)
    },
    getManyByEmployeeId(state) {
      return (employeeId: number) => Object.values(state.entities.byId).filter(answer => answer.employeeId === employeeId)
    },
  },

  actions: {

    ...createActions<AnswerType>(answerState),

    resetState() {
      this.$state = defaultAnswerState()
    },
    // bellow Actions in this specific store
  },
})
