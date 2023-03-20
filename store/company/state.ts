import { createState } from '@malolebrin/pinia-entity-store'
import type { Company } from './types'

export const companyState = defaultCompanyState()

export function defaultCompanyState() {
  return {
    ...createState<Company>(),
  }
}
