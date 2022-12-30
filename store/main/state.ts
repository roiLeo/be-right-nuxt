import { ThemeEnum } from '@/types'

export function defaultState() {
  return {
    theme: ThemeEnum.LIGHT,
    areCookiesAccepted: false,
  }
}
