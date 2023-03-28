import { RouteNames } from '~~/helpers/routes'
import type { EventTypeCreate } from '~~/store'
import { useEventStore, useFormStore, useUiStore } from '~~/store'
import type { BaseAddressCreationForm, PhotographerCreatePayload } from '~~/store/form/types'
import { FormEnum } from '~~/store/form/types'

export default function eventFormHook() {
  const { $router } = useNuxtApp()

  const formStore = useFormStore()
  const eventStore = useEventStore()
  const { setOneActive } = eventStore
  const uiStore = useUiStore()
  const { IncLoading, DecLoading } = uiStore

  const { postPhotographer } = userHook()
  const { postOne: postOneEvent } = eventHook()

  const isEventCreation = computed(() => $router.currentRoute.value.name === RouteNames.CREATE_EVENT_STEP_1)
  const isEmployeeStepEventCreation = computed(() => $router.currentRoute.value.name === RouteNames.CREATE_EVENT_STEP_2)
  const isPhotographerCreation = computed(() => $router.currentRoute.value.name === RouteNames.CREATE_EVENT_STEP_3)
  const isEnd = computed(() => $router.currentRoute.value.name === RouteNames.CREATE_EVENT_STEP_PAYMENT)

  const currentStepIndex = computed(() => {
    if (isEventCreation.value) {
      return 0
    }
    if (isEmployeeStepEventCreation.value) {
      return 1
    }
    if (isPhotographerCreation.value) {
      return 2
    }
    if (isEnd.value) {
      return 3
    }
    return 0
  })

  async function submitCreationEvent() {
    IncLoading()
    let photographer = null

    const {
      isSelectedPhotographerValid,
      isNewPhotographerValid,
      getFormState,
      getPhotographerId,
      resetForm,
    } = formStore

    if (!isSelectedPhotographerValid && isNewPhotographerValid) {
      const payload = getFormState(FormEnum.PHOTOGRAPHER_FORM)
      photographer = await postPhotographer(payload as PhotographerCreatePayload)
    }

    const photographerId = photographer?.id || getPhotographerId

    if (photographerId) {
      const newEvent = await postOneEvent(
        {
          event: getFormState(FormEnum.EVENT_FORM) as unknown as EventTypeCreate,
          address: getFormState(FormEnum.ADDRESS_FORM) as BaseAddressCreationForm,
          photographerId,
        })

      if (newEvent) {
        setOneActive(newEvent.id)
        resetForm(FormEnum.EVENT_FORM)
        resetForm(FormEnum.PHOTOGRAPHER_FORM)
        resetForm(FormEnum.ADDRESS_FORM)
      }
    }
    DecLoading()
  }

  return {
    currentStepIndex,
    isEmployeeStepEventCreation,
    submitCreationEvent,
    isEnd,
    isEventCreation,
    isPhotographerCreation,
  }
}
