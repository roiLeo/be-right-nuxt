import type { AnswerType } from '~~/store'
import { useAnswerStore, useUiStore } from '~~/store'

export default function answerHook() {
  const { $toast, $api } = useNuxtApp()
  const answerStore = useAnswerStore()
  const { IncLoading, DecLoading } = useUiStore()

  // async function postMany(eventId: number, employeeIds: number[]) {
  //   IncLoading()
  //   if (eventId && employeeIds.length > 0) {
  //     try {
  //       const { data: answers } = await $api().post<AnswerType[]>('answer/many', { eventId, employeeIds })
  //       if (answers && answers.length > 0) {
  //         answerStore.createMany(answers)
  //       }
  //     } catch (error) {
  //       console.error(error)
  //       $toast.error('Une erreur est survenue')
  //     }
  //   } else {
  //     $toast.error('Veuillez sélectionner au moins un participant et un événement')
  //   }
  //   DecLoading()
  // }

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
          answerStore.createMany(answersNotInStore)
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
            answerStore.createMany(answersNotInStore)
          }
        }
      }
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
    DecLoading()
  }

  return {
    // postMany,
    filteringAnswersNotInStore,
    fetchManyAnswerForEvent,
    fetchManyAnswerForManyEvent,
  }
}
