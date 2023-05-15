import { hasOwnProperty, uniq } from '@antfu/utils'
import dayjs from 'dayjs'
import type { ActionResponse, ErrorResponse, ResponseAnswerSignature } from '~/types/Payload'
import type { AnswerType, EmployeeType } from '~~/store'
import { useAnswerStore, useUiStore } from '~~/store'

export default function answerHook() {
  const { $toast, $api } = useNuxtApp()
  const answerStore = useAnswerStore()
  const { addMany, updateOneAnswer } = answerStore
  const { IncLoading, DecLoading } = useUiStore()

  async function postMany(eventId: number, employeeIds: number[]) {
    IncLoading()
    if (eventId && employeeIds.length > 0) {
      try {
        const { data: answers } = await $api().post<AnswerType[]>('answer/many', { eventId, employeeIds })
        if (answers && answers.length > 0) {
          addMany(answers)
        }
      } catch (error) {
        console.error(error)
        $toast.danger('Une erreur est survenue')
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
    try {
      const { data: answers } = await $api().get<AnswerType[]>(`answer/event/${eventId}`)

      if (answers && answers.length > 0) {
        const answersNotInStore = filteringAnswersNotInStore(answers)
        if (answersNotInStore.length > 0) {
          addMany(answersNotInStore)
        }
      }
    } catch (error) {
      console.error(error)
      $toast.danger('Une erreur est survenue')
    }
    DecLoading()
  }

  async function fetchManyAnswerForManyEvent(eventIds: number[]) {
    IncLoading()
    try {
      if (eventIds?.length > 0) {
        const { data: answers } = await $api().get<AnswerType[]>(`answer/event/manyByIds/?ids=${eventIds.join(',')}`)

        if (answers && answers.length > 0) {
          const answersNotInStore = filteringAnswersNotInStore(answers)

          if (answersNotInStore.length > 0) {
            addMany(answersNotInStore)
          }
        }
      }
    } catch (error) {
      console.error(error)
      $toast.danger('Une erreur est survenue')
    }
    DecLoading()
  }

  async function fetchMany(ids: number[]) {
    IncLoading()
    try {
      const answerIds = ids?.length > 1 ? uniq(ids) : ids
      if (answerIds?.length > 0) {
        const { data: answers } = await $api().get<AnswerType[]>(`answer/manyByIds?ids=${answerIds.join(',')}`)

        if (answers && answers.length > 0) {
          const answersNotInStore = filteringAnswersNotInStore(answers)

          if (answersNotInStore.length > 0) {
            addMany(answersNotInStore)
          }
        }
      }
    } catch (error) {
      console.error(error)
      $toast.danger('Une erreur est survenue')
    }
    DecLoading()
  }

  async function raiseAnswer(id: number) {
    IncLoading()
    try {
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
    } catch (error) {
      console.error(error)
      $toast.danger('Une erreur est survenue')
    }
    DecLoading()
  }

  async function downloadAnswer({ answerId, employee, templateRef }: { answerId: number; employee: EmployeeType; templateRef: HTMLElement }) {
    await exportToPDF(`droit-image-${answerId}-${employee.firstName}-${employee.lastName}.pdf`, templateRef,
      {
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16, // or "smart", default is 16
      },
    )
  }

  function isAnswerType(obj: any): obj is AnswerType {
    return hasOwnProperty(obj, 'hasSigned') && hasOwnProperty(obj, 'eventId') && hasOwnProperty(obj, 'employeeId')
  }

  function areAnswersType(array: any[]): array is AnswerType[] {
    return array?.every(item => isAnswerType(item))
  }

  async function getAnswerForSignature({ email, token }: { email: string; token: string }) {
    try {
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
    } catch (error) {
      console.error(error)
      $toast.danger('Une erreur est survenue')
    }
  }

  async function updateAnswerForEmployee({
    answerId,
    hasSigned,
    email,
    token,
    reason,
  }: {
    answerId: number
    hasSigned: boolean
    email: string
    token: string
    reason?: string
  }) {
    IncLoading()
    try {
      if (answerId && email && token && noNull(hasSigned) && noUndefined(hasSigned)) {
        const { data: answer } = await $api().patch<AnswerType>(`answer/signed/${answerId}`, {
          token,
          hasSigned,
          email,
          reason,
        })

        if (answer) {
          if (answerStore.isAlreadyInStore(answer.id)) {
            updateOneAnswer(answer.id, answer)
          } else {
            addMany([answer])
          }
        }
      }
    } catch (error) {
      console.error(error)
      $toast.danger('Une erreur est survenue')
    }
    DecLoading()
  }

  function canAnswerBeRaise(answer: AnswerType): boolean {
    if (answer.mailSendAt) {
      const now = dayjs().subtract(5, 'day')
      return dayjs(answer.mailSendAt).isBefore(now)
    }
    return true
  }

  return {
    areAnswersType,
    canAnswerBeRaise,
    downloadAnswer,
    fetchMany,
    fetchManyAnswerForEvent,
    fetchManyAnswerForManyEvent,
    filteringAnswersNotInStore,
    getAnswerForSignature,
    postMany,
    raiseAnswer,
    updateAnswerForEmployee,
  }
}
