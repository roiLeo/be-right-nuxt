import type { BaseEntity, EmployeeType, UserType } from '~~/types'

export interface Group extends BaseEntity {
  name: string
  description: string | null
  createdByUser?: UserType
  createdByUserId: number
  employees?: EmployeeType[]
  employeeIds: number[]
}

export type GroupCreationPayload = Pick<Group, 'name' | 'description' | 'employeeIds'>
