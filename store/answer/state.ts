import { createState } from '@malolebrin/pinia-entity-store'
import type { AnswerType } from './types'

export const answerState = createState<AnswerType>()

export function defaultAnswerState() {
  return createState<AnswerType>()
}
