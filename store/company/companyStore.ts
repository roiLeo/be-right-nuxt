import { defineStore } from 'pinia'
import { createActions, createGetters } from '@malolebrin/pinia-entity-store'
import { uniq } from '@antfu/utils'
import { useUserStore } from '../user'
import { companyState } from './state'
import type { Company } from './types'

export const useCompanyStore = defineStore('company', {
  state: () => ({ ...companyState }),

  getters: {
    ...createGetters<Company>(companyState),

    getAuthCompany: state => {
      const userStore = useUserStore()
      const user = userStore.getAuthUser
      if (user) {
        return state.entities.byId[user.companyId]
      }
      return null
    },
  },

  actions: {
    ...createActions<Company>(companyState),

    addOne(company: Company) {
      if (this.entities.byId[company.id] === null || this.entities.byId[company.id] === undefined) {
        this.entities.byId[company.id] = { ...company, $isDirty: false }
        this.entities.allIds = uniq([...this.entities.allIds, company.id])
      }
    },

    addMany(companies: Company[]) {
      companies.forEach(company => this.addOne(company))
    },

    updateOneCompany(id: number, data: Partial<Company>) {
      if (this.entities.byId[id] !== null || this.entities.byId[id] !== undefined) {
        this.entities.byId[id] = {
          ...this.entities.byId[id],
          ...data,
        }
      }
    },

  },
})
