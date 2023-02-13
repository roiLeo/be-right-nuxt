import { useAnswerStore } from '~~/store'

export default defineNuxtRouteMiddleware(async to => {
  const answerId = parseInt(to.params.id.toString())

  const answerStore = useAnswerStore()

  const { fetchMany } = answerHook()
  const { fetchEventWithRelations } = eventHook()

  if (answerId && !answerStore.getOne(answerId)) {
    await fetchMany([answerId])
  }

  const answer = answerStore.getOne(answerId)

  if (answer && answer.eventId) {
    await fetchEventWithRelations(answer.eventId)
  }
})
