import type { State } from '@malolebrin/pinia-entity-store'
import type { Group } from '../group'
import type { AddressType, AnswerType, FileType } from '@/types'
import type { BaseEntity } from '@/types/globals'
import type { UserType } from '@/store/user/types'

export interface EmployeeType extends BaseEntity {
  email: string
  phone: string
  firstName: string
  lastName: string
  hasSigned: boolean
  bornAt: Date
  slug: string
  signedAt: Date
  createdByUser?: null | UserType
  createdByUserId: number
  files?: FileType[]
  filesIds: number[]
  answers?: AnswerType[]
  answersIds: number[]
  groups?: Group[]
  groupIds: number[]
  address?: AddressType | null
  addressId: number
}

export type EmployeeFormType = Omit<EmployeeType, 'id' | 'createdAt' | 'updatedAt' | 'files' | 'answers'>

export type EmployeeTypeOmitRelations = Omit<EmployeeType, 'createdAt' | 'updatedAt' | 'files' | 'answers' | 'address' | 'event' | 'createdByUser'>

export interface EmployeeState extends State<EmployeeType> { }
