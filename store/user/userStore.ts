import { defineStore } from 'pinia'
import { createActions, createGetters } from '@malolebrin/pinia-entity-store'
import { uniq } from '@antfu/utils'
import { useAuthStore } from '../auth/authStore'
import type { UserType } from './types'
import { defaultUserState, userState } from './state'

export const useUserStore = defineStore('user', {
  state: () => ({
    ...userState,
  }),

  getters: {
    ...createGetters<UserType>(userState),

    getOneByEmail: state => {
      return (email: string) => Object.values(state.entities.byId).find(user => user.email === email)
    },

    getAuthUser: state => {
      const authStore = useAuthStore()
      return Object.values(state.entities.byId).find(user => user.email === authStore.user?.email)
    },

    getAuthUserId: state => {
      const authStore = useAuthStore()
      return Object.values(state.entities.byId).find(user => user.email === authStore.user?.email)?.id
    },

    getUserByCompanyId: state => {
      return (companyId: number) => Object.values(state.entities.byId).find(user => user.companyId === companyId)
    },
  },

  actions: {
    ...createActions<UserType>(userState),

    addOne(user: UserType) {
      if (this.entities.byId[user.id] === null || this.entities.byId[user.id] === undefined) {
        this.entities.byId[user.id] = { ...user, $isDirty: false }
        this.entities.allIds = uniq([...this.entities.allIds, user.id])
      }
    },

    addMany(users: UserType[]) {
      users.forEach(user => this.addOne(user))
    },

    updateOneUser(id: number, data: Partial<UserType>) {
      if (this.entities.byId[id] !== null || this.entities.byId[id] !== undefined) {
        this.entities.byId[id] = {
          ...this.entities.byId[id],
          ...data,
        }
      }
    },

    resetState() {
      this.$state = defaultUserState()
    },
  },

})
