import { createState } from '@malolebrin/pinia-entity-store'
import type { EmployeeType } from './types'

export const employeState = createState<EmployeeType>()

export function defaultEmployeeState() {
  return createState<EmployeeType>()
}
