import { defineStore } from 'pinia'
import { noNull, notUndefined } from '@antfu/utils'
import { defaultAuthState, state } from './state'
import type { JWTDecodedType } from '@/types'
import { RoleEnum } from '@/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    ...state,
  }),
  getters: {
    isAuthUserAdmin: state => state.user?.roles.includes(RoleEnum.ADMIN),
    getIsLoggedIn: state => noNull(state.user) && notUndefined(state.user),
    getLoggedUserFullName: state => {
      if (state.user) {
        let str = ''
        if (state.user?.firstName)
          str += state.user.firstName
        if (state.user?.lastName)
          str += ` ${state.user.lastName}`
        return str
      }
    },
  },

  actions: {
    setJWTasUser(payload: JWTDecodedType) {
      this.user = payload
    },

    resetAuthState() {
      this.$state = defaultAuthState()
    },
  },
})
