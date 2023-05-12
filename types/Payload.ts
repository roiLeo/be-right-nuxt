import type { EmployeeType, EventType, RoleEnum } from '.'
import type { AnswerType } from '~/store/answer/types'

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

export interface ActionResponse {
  message: string
  isSuccess: boolean
}

export interface ErrorResponse {
  message: string
  success: boolean
  stack: string
}

export interface ResetPasswordData {
  isSuccess: boolean
  message: string
}

export interface ResponseAnswerSignature {
  answer: AnswerType
  event: EventType
  employee: EmployeeType
}
