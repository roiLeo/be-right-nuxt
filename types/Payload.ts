import type { RoleEnum } from '.'

export interface RegisterPayload {
  companyName: string
  email: string
  password: string
  firstName: string
  lastName: string
  roles: RoleEnum
}

export interface Loginpayload {
  email: string
  password: string
}
