import type { State } from './types'

export function defaultAuthState(): State {
  return {
    user: null,
  }
}
export const state = defaultAuthState()
