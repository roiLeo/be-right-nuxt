import { defineStore } from 'pinia'
import { createActions, createGetters } from '@malolebrin/pinia-entity-store'
import { useAnswerStore } from '../answer'
import { useUserStore } from '../user'
import { defaultEmployeeState, employeState } from './state'
import type { EmployeeType } from './types'

export const useEmployeeStore = defineStore('employees', {
  state: () => ({
    ...employeState,
  }),
  getters: {
    ...createGetters<EmployeeType>(employeState),

    // bellow getters in this specific store,
    getAllByEventId: state => (eventId: number) => {
      const answerStore = useAnswerStore()
      const answers = answerStore.getManyByEventId(eventId)
      const employeeIds = answers.map(an => an.employeeId)
      return Object.values(state.entities.byId).filter(employee => employeeIds.includes(employee.id))
    },

    getEmployeesByUserId: state => {
      return (companyId: number) => Object.values(state.entities.byId).filter(employee => employee.companyId === companyId)
    },

    getEmployeesForAuthUser: state => {
      const userStore = useUserStore()
      const user = userStore.getAuthUser
      return Object.values(state.entities.byId).filter(employee => employee.companyId === user?.companyId)
    },

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

    deleteOneEmployee(id: number) {
      delete this.entities.byId[id]
      this.entities.allIds = this.entities.allIds.filter(entityId => entityId !== id)
    },

  },
})
