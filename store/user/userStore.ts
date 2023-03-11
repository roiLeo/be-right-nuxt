import { defineStore } from 'pinia'
import { createActions, createGetters } from '@malolebrin/pinia-entity-store'
import { uniq } from '@antfu/utils'
import { useAuthStore } from '../auth/authStore'
import type { PhotographerCreatePayload, UserType } from './types'
import { basePhotographerForm, defaultUserState, userState } from './state'
import { RoleEnum } from '@/types/Roles'

export const useUserStore = defineStore('user', {
  state: () => ({
    ...userState,
  }),

  getters: {
    ...createGetters<UserType>(userState),
    // getUserById: (state) => {
    //   return (userId) => state.users.find((user) => user.id === userId)
    // },

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

    setPhotographerForm(payload: PhotographerCreatePayload) {
      this.photographerForm = payload
    },
    resetPhotographerForm() {
      this.photographerForm = basePhotographerForm
    },

    resetState() {
      this.$state = defaultUserState()
    },
  },

})
