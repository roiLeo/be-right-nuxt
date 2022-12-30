import type { JWTDecodedType } from '@/types'

export interface State {
  user: null | JWTDecodedType
}
