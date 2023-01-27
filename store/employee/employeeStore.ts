import { defineStore } from 'pinia'
import { createActions, createGetters } from '@malolebrin/pinia-entity-store'
import { defaultEmployeeState, employeState } from './state'
import type { EmployeeType } from './types'

export const useEmployeeStore = defineStore('employees', {
  state: () => ({
    ...employeState,
  }),
  getters: {
    ...createGetters<EmployeeType>(employeState),

    // bellow getters in this specific store,
    // getAllByEventId: state => (eventId: number) => {
    //   return Object.values(state.entities.byId).filter(employee => employee.event === eventId)
    // },
    // getEmployeesByUserId: state => {
    //   return (userId: number) => Object.values(state.entities.byId).filter(employee => employee.createdByUser === userId)
    // },

  },
  actions: {
    // actions common to all entities
    ...createActions<EmployeeType>(employeState),

    addMany(employees: EmployeeType[]) {
      employees.forEach(emp => {
        this.entities.byId[emp.id] = { ...emp, $isDirty: false }
        this.entities.allIds.push(emp.id)
      })
    },

    resetState() {
      this.$state = defaultEmployeeState()
    },
  },
})
