import { defineStore } from 'pinia'
import { defaultState } from './state'
import { ThemeEnum } from '@/types'

export const useMainStore = defineStore('main', {
  state: () => ({
    theme: ThemeEnum.LIGHT,
    areCookiesAccepted: false,
  }),
  getters: {
    getTheme: state => state.theme,
    isDarkTheme: state => state.theme === ThemeEnum.DARK,
    getAreCookiesAccepted: state => state.areCookiesAccepted,
  },
  actions: {
    resetAllState() {
      this.$state = defaultState()
    },
    setCookiesAccepted() {
      this.areCookiesAccepted = true
    },
  },
})
