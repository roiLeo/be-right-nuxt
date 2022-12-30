import type { State } from './types'

export function defaultState(): State {
  return {
    user: null,
  }
}
export const state = defaultState()
