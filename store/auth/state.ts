import type { State } from './types'

export const defaultAuthState = (): State => {
  return {
    user: null,
    token: null,
  }
}
export const state = defaultAuthState()
