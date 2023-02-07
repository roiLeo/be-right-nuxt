import type { State } from '@malolebrin/pinia-entity-store'
import type { EmployeeType, EventType } from '@/types'
import type { BaseEntity } from '@/types/globals'

export interface AnswerType extends BaseEntity {
  hasSigned: boolean
  signedAt: Date
  reason: string
  employee?: null | EmployeeType
  employeeId: number | null
  event?: null | EventType
  eventId: number | null
}

export type AnswerFormType = Omit<AnswerType, 'id' | 'createdAt' | 'updatedAt'>

export interface AnswerState extends State<AnswerType> { }
