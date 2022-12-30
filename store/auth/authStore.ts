import { defineStore } from 'pinia'
import { noNull, notUndefined } from '@antfu/utils'
import { state } from './state'
import type { JWTDecodedType } from '@/types'
import { RoleEnum } from '@/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    ...state,
  }),
  getters: {
    isAuthUserAdmin: state => state.user?.roles.includes(RoleEnum.ADMIN),
    getIsLoggedIn: state => noNull(state.user) && notUndefined(state.user),
    // getLoggedUserFullName: state => {
    //   if (state.user) {
    //     const { getUserfullName } = userHook()
    //     return getUserfullName(state.user)
    //   }
    // },
    // TODO fix when userHook is created
  },
  actions: {
    setJWTasUser(payload: JWTDecodedType) {
      this.user = payload
    },
  },
})
