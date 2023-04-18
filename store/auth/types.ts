import type { JwtPayload } from 'jsonwebtoken'

export interface State {
  user: null | JwtPayload
  token: null | string
}
