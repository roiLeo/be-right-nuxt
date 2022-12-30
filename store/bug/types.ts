import type { BaseEntity } from '@/types'

export enum BugReportTypeEnum {
  BUG = 'bug',
  FEATURE_REQUEST = 'feature_request',
}

export enum BugReportTypeTranslation {
  bug = 'problème/bug',
  feature_request = 'demande de fonctionnalité',
}

export const BUGS_REPORTS_TYPE_ARRAY = Object.values(BugReportTypeEnum)

export enum BugReportStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  WILL_NOT_FIX = 'will_not_fix',
}

export const bugReportSearchableFields = [
  'name',
  'type',
  'status',
  'url',
  'createdByUser',
  'createdAt',
]

export interface BugReportType extends BaseEntity {
  name: string
  type: BugReportTypeEnum
  status: BugReportStatus
  url: string
  description: string
  file: number
  createdByUser: number
}

export type BugReportCreationFormType = Omit<BugReportType, 'id' | 'createdAt' | 'updatedAt' | 'file' | 'createdByUser'>
