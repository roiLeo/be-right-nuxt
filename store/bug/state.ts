import { createState } from '@malolebrin/pinia-entity-store'
import type { BugReportCreationFormType, BugReportType } from './types'
import { BugReportStatus, BugReportTypeEnum } from './types'

export const baseBugCreationForm: BugReportCreationFormType = {
  name: '',
  type: BugReportTypeEnum.BUG,
  status: BugReportStatus.OPEN,
  url: '',
  description: '',
}

export const bugState = defaultBugState()

export function defaultBugState() {
  return {
    ...createState<BugReportType>(),
    creationForm: baseBugCreationForm,
  }
}
