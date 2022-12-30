import { defineStore } from 'pinia'
import { createActions, createGetters } from '@malolebrin/pinia-entity-store'
import { defaultEmployeeState, employeState } from './state'
import type { EmployeeType } from './types'
import { EntitiesEnum } from '@/types/globals'

export const useEmployeeStore = defineStore(EntitiesEnum.EMPLOYEES, {
  state: () => ({
    ...employeState,
  }),
  getters: {
    ...createGetters<EmployeeType>(employeState),

    // bellow getters in this specific store,
    getAllByEventId: state => (eventId: number) => {
      return Object.values(state.entities.byId).filter(employee => employee.event === eventId)
    },
    getEmployeesByUserId: state => {
      return (userId: number) => Object.values(state.entities.byId).filter(employee => employee.createdByUser === userId)
    },

  },
  actions: {
    // actions common to all entities
    ...createActions<EmployeeType>(employeState),

    resetState() {
      this.$state = defaultEmployeeState()
    },
  },
})

export default useEmployeeStore
