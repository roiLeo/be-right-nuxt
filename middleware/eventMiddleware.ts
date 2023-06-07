import { useUiStore } from '~~/store'

export default defineNuxtRouteMiddleware(async to => {
  const eventId = parseInt(to.params.id.toString())

  const uiStore = useUiStore()
  const { IncLoading, DecLoading } = uiStore

  const { fetchEventWithRelations } = eventHook()

  if (eventId) {
    IncLoading()
    await fetchEventWithRelations(eventId)
    DecLoading()
  }
})
