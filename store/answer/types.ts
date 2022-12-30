import type { State } from '@malolebrin/pinia-entity-store'
import type { EmployeeType, EventType } from '@/types'
import type { BaseEntity } from '@/types/globals'

export interface AnswerType extends BaseEntity {
  hasSigned: boolean
  signetAt: Date
  reason: string
  employee: number | EmployeeType
  event: number | EventType
}

export type AnswerFormType = Omit<AnswerType, 'id' | 'createdAt' | 'updatedAt'>

export interface AnswerState extends State<AnswerType> { }
