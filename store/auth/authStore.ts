import { defineStore } from 'pinia'
import { noNull, notUndefined } from '@antfu/utils'
import type { JwtPayload } from 'jsonwebtoken'
import { defaultAuthState, state } from './state'
import { RoleEnum } from '@/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    ...state,
  }),
  getters: {
    isAuthUserAdmin: state => state.user?.roles.includes(RoleEnum.ADMIN),
    isAuthUserOwner: state => state.user?.roles.includes(RoleEnum.OWNER),

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

    getToken: state => state.token,
  },

  actions: {
    setJWTasUser(payload: JwtPayload) {
      this.user = payload
    },

    setToken(token: string) {
      this.token = token
    },

    resetAuthState() {
      this.$state = defaultAuthState()
    },
  },
})
