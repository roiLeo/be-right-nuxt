import type { State } from '@malolebrin/pinia-entity-store'
import type { Group } from '../group'
import type { Company } from '../company'
import type { AddressType, AnswerType, FileType } from '@/types'
import type { BaseEntity } from '@/types/globals'

export interface EmployeeType extends BaseEntity {
  email: string
  phone: string
  firstName: string
  lastName: string
  hasSigned: boolean
  bornAt: Date
  slug: string
  signedAt: Date

  company?: null | Company
  companyId: number

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

export type EmployeeTypeOmitRelations = Omit<EmployeeType, 'createdAt' | 'updatedAt' | 'files' | 'answers' | 'address' | 'event' | 'company'>

export interface EmployeeState extends State<EmployeeType> { }
