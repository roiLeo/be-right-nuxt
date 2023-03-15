import { hasOwnProperty, uniq } from '@antfu/utils'
import type { AnswerType, EmployeeType } from '~~/store'
import { useAnswerStore, useUiStore } from '~~/store'

export default function answerHook() {
  const { $toast, $api } = useNuxtApp()
  const answerStore = useAnswerStore()
  const { addMany } = answerStore
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
        $toast.error('Une erreur est survenue')
      }
    } else {
      $toast.error('Veuillez sélectionner au moins un participant et un événement')
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
      $toast.error('Une erreur est survenue')
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
      $toast.error('Une erreur est survenue')
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
      $toast.error('Une erreur est survenue')
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
    return array.every(item => isAnswerType(item))
  }

  return {
    postMany,
    filteringAnswersNotInStore,
    fetchMany,
    fetchManyAnswerForEvent,
    fetchManyAnswerForManyEvent,
    downloadAnswer,
    areAnswersType,
  }
}
