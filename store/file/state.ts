import { createState } from '@malolebrin/pinia-entity-store'
import type { FileType } from './types'

export const fileState = createState<FileType>()

export function defaultFileState() {
  return createState<FileType>()
}
