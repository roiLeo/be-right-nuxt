import { hasOwnProperty, uniq } from '@antfu/utils'
import type { ActionResponse, ErrorResponse, ResponseAnswerSignature } from '~/types/Payload'
import type { AnswerType } from '~~/store'
import { useAnswerStore, useUiStore } from '~~/store'

export default function answerHook() {
  const { $toast, $api } = useNuxtApp()
  const answerStore = useAnswerStore()
  const { addMany, updateOneAnswer } = answerStore
  const { IncLoading, DecLoading } = useUiStore()

  async function postMany(eventId: number, employeeIds: number[]) {
    IncLoading()
    if (eventId && employeeIds.length > 0) {
      const { data: answers } = await $api().post<AnswerType[]>('answer/many', { eventId, employeeIds })
      if (answers && answers.length > 0 && areAnswersType(answers)) {
        addMany(answers)
      }
    } else {
      $toast.danger('Veuillez sélectionner au moins un participant et un événement')
    }
    DecLoading()
  }

  function filteringAnswersNotInStore(answers: AnswerType[]) {
    if (answers.length > 0) {
      return answers.filter(answer => !answerStore.isAlreadyInStore(answer.id))
    }
    return []
  }

  async function fetchManyAnswerForEvent(eventId: number) {
    IncLoading()
    const { data: answers } = await $api().get<AnswerType[]>(`answer/event/${eventId}`)

    if (answers && answers.length > 0 && areAnswersType(answers)) {
      const answersNotInStore = filteringAnswersNotInStore(answers)
      if (answersNotInStore.length > 0) {
        addMany(answersNotInStore)
      }
    }
    DecLoading()
  }

  async function fetchManyAnswerForManyEvent(eventIds: number[]) {
    IncLoading()
    if (eventIds?.length > 0) {
      const { data: answers } = await $api().get<AnswerType[]>(`answer/event/manyByIds/?ids=${eventIds.join(',')}`)

      if (answers && answers.length > 0 && areAnswersType(answers)) {
        const answersNotInStore = filteringAnswersNotInStore(answers)

        if (answersNotInStore.length > 0) {
          addMany(answersNotInStore)
        }

        const answersToUpdate = answers.filter(answer => answerStore.isAlreadyInStore(answer.id))
        if (answersToUpdate.length > 0) {
          answersToUpdate.forEach(answer => updateOneAnswer(answer.id, answer))
        }
      }
    }
    DecLoading()
  }

  async function fetchMany(ids: number[]) {
    IncLoading()
    const answerIds = ids?.length > 1 ? uniq(ids) : ids
    if (answerIds?.length > 0) {
      const { data: answers } = await $api().get<AnswerType[]>(`answer/manyByIds?ids=${answerIds.join(',')}`)

      if (answers && answers.length > 0 && areAnswersType(answers)) {
        const answersNotInStore = filteringAnswersNotInStore(answers)

        if (answersNotInStore.length > 0) {
          addMany(answersNotInStore)
        }
      }
    }
    DecLoading()
  }

  async function raiseAnswer(id: number) {
    IncLoading()
    if (id) {
      const { data } = await $api().get<ActionResponse & { answer: AnswerType }>(`answer/raise/${id}`)
      if (data) {
        const { isSuccess, answer, message } = data

        if (isSuccess) {
          updateOneAnswer(id, answer)
        }

        return {
          message,
          isSuccess,
        }
      }
    }
    DecLoading()
  }

  function isAnswerType(obj: any): obj is AnswerType {
    return hasOwnProperty(obj, 'hasSigned') && hasOwnProperty(obj, 'eventId') && hasOwnProperty(obj, 'employeeId')
  }

  function areAnswersType(array: any[]): array is AnswerType[] {
    return array?.every(item => isAnswerType(item))
  }

  async function getAnswerForSignature({ email, token }: { email: string; token: string }) {
    if (email && token) {
      const { success, data } = await $api().post<
        ErrorResponse | ResponseAnswerSignature>('answer/forSignature', { email, token })

      return {
        success,
        data,
      }
    }
    return {
      success: false,
      data: {
        message: 'Paramètres manquants',
      },
    }
  }

  async function updateAnswerForEmployee({
    answerId,
    hasSigned,
    email,
    token,
    reason,
    signature,
    isSavedSignatureForNextTime,
  }: {
    answerId: number
    hasSigned: boolean
    email: string
    token: string
    reason?: string
    signature: string
    isSavedSignatureForNextTime: boolean
  }) {
    IncLoading()
    if (answerId && email && token && noNull(hasSigned) && noUndefined(hasSigned)) {
      const { data: answer } = await $api().patch<AnswerType>(`answer/signed/${answerId}`, {
        token,
        hasSigned,
        email,
        reason,
        isSavedSignatureForNextTime,
        signature,
      })

      if (answer && isAnswerType(answer)) {
        if (answerStore.isAlreadyInStore(answer.id)) {
          updateOneAnswer(answer.id, answer)
        } else {
          addMany([answer])
        }
      }
    }
    DecLoading()
  }

  function isAnswerSigned(answer: AnswerType): boolean {
    return answer.signedAt !== null && answer.signedAt !== undefined
  }

  return {
    areAnswersType,
    fetchMany,
    fetchManyAnswerForEvent,
    fetchManyAnswerForManyEvent,
    filteringAnswersNotInStore,
    getAnswerForSignature,
    isAnswerSigned,
    postMany,
    raiseAnswer,
    updateAnswerForEmployee,
  }
}
