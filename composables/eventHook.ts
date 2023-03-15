import { hasOwnProperty, uniq } from '@antfu/utils'
import type { AnswerType } from '~~/store'
import {
  useAddressStore,
  useAnswerStore,
  useEmployeeStore,
  useEventStore,
  useFileStore,
  useUiStore,
  useUserStore,
} from '~~/store'
import type { AddressType, EventCreatePayload, EventType, PaginatedResponse } from '~~/types'
import { EventStatusEnum, getEventStatusTranslationEnum } from '~~/types'

export default function eventHook() {
  const { $toast, $api } = useNuxtApp()

  const { fetchManyAnswerForEvent, areAnswersType } = answerHook()
  const { fetchEmployeesByEventId } = employeeHook()
  const { fetchMany: fetchManyUsers } = userHook()
  const { fetchMany: fetchManyAddress } = addressHook()
  const { fetchManyFiles } = fileHook()

  const eventStore = useEventStore()
  const { deleteEventAndRelations } = eventStore
  const { isAddressType } = addressHook()
  const { DecLoading, IncLoading } = useUiStore()
  const addressStore = useAddressStore()
  const employeeStore = useEmployeeStore()
  const userStore = useUserStore()
  const answerStore = useAnswerStore()
  const fileStore = useFileStore()
  const { createOne: createOneAddress } = addressStore

  function getEventStatusTranslation(status: EventStatusEnum) {
    return getEventStatusTranslationEnum[status]
  }

  function getEventStatusColor(status: EventStatusEnum) {
    switch (status) {
      case EventStatusEnum.PENDING:
        return 'text-orange'
      case EventStatusEnum.CREATE:
        return 'dark:text-white-break text-black'
      case EventStatusEnum.CLOSED:
        return 'text-gray-500'
      case EventStatusEnum.COMPLETED:
        return 'text-green'
      default:
        return 'text-gray-500'
    }
  }

  function storeEventRelationEntities(events: EventType[]) {
    if (events?.length > 0) {
      const eventsToStore = events.map(event => {
        const address = event.address
        if (address) {
          if (!addressStore.isAlreadyInStore(address?.id)) {
            createOneAddress(address)
            delete event.address
          }
        }

        const partner = event.partner
        if (partner && !userStore.isAlreadyInStore(partner.id)) {
          userStore.createOne(partner)
          delete event.partner
        }

        const creator = event.createdByUser
        if (creator && !userStore.isAlreadyInStore(creator.id)) {
          userStore.createOne(creator)
          delete event.createdByUser
        }

        const files = event.files
        if (files && files.length > 0) {
          const missingfiles = files.filter(file => !fileStore.isAlreadyInStore(file.id))
          fileStore.createMany(missingfiles)
          delete event.files
        }

        return {
          ...event,
        }
      })
      eventStore.addMany(eventsToStore)
      return eventsToStore
    }
    return []
  }

  function sortEventByDate(events: EventType[]) {
    return events.sort((a, b) => {
      if (a.start < b.start)
        return 1
      if (a.start > b.start)
        return -1
      return 0
    })
  }

  async function fetchAllEvents(url?: string) {
    IncLoading()
    try {
      let finalUrl = 'event'
      if (url) {
        finalUrl += `${url}`
      }
      const { data } = await $api().get<PaginatedResponse<EventType>>(finalUrl)

      if (data) {
        storeEventRelationEntities(data.data)
      }
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
    DecLoading()
  }

  async function fetchEventsByUser(userId: number) {
    IncLoading()
    try {
      if (userId) {
        const { data } = await $api().get<EventType[]>(`event/user/${userId}`)

        if (data) {
          const missingIds = data.map((event: EventType) => event.id).filter(id => !eventStore.isAlreadyInStore(id))

          if (missingIds.length > 0) {
            const events = data.filter(event => missingIds.includes(event.id))
            storeEventRelationEntities(events)
          }
        }
      }
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
    DecLoading()
  }

  async function fetchOne(id: number) {
    IncLoading()
    try {
      const { data: event } = await $api().get<EventType>(`event/${id}`)

      if (event && !eventStore.isAlreadyInStore(event.id)) {
        storeEventRelationEntities([event])
      }
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
    DecLoading()
  }

  async function postOne(payload: EventCreatePayload): Promise<EventType | undefined> {
    try {
      const { data } = await $api().post<{
        event: EventType
        address: AddressType
        answers: AnswerType[]
      }>('event', payload)

      if (data) {
        const { event, address, answers } = data

        if (isEventType(event)) {
          eventStore.addMany([event])
        }

        if (isAddressType(address)) {
          addressStore.addOne(address)
        }

        if (areAnswersType(answers)) {
          answerStore.addMany(answers)
        }

        $toast.success('L\'événement a été créé avec succès')
        return event
      }
      return undefined
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
  }

  async function patchOne(event: EventType) {
    if (event && event.id) {
      IncLoading()
      try {
        const { data } = await $api().patch<EventType>(`event/${event.id}`, event)
        if (data && isEventType(data)) {
          eventStore.updateOne(data.id, data)
          $toast.success('L\'événement a été mis à jour avec succès')
        }
      } catch (error) {
        console.error(error)
        $toast.error('Une erreur est survenue')
      }
      DecLoading()
    }
  }

  async function deleteOne(id: number) {
    IncLoading()
    try {
      const { success } = await $api().delete(`event/${id}`)
      if (success) {
        deleteEventAndRelations(id)
      }
      $toast.success('L\'événement a été supprimé avec succès')
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
    DecLoading()
  }

  function isEventType(event: any): event is EventType {
    return hasOwnProperty(event, 'start') && hasOwnProperty(event, 'end')
  }

  async function fetchEventWithRelations(eventId: number) {
    IncLoading()

    if (!eventStore.isAlreadyInStore(eventId)) {
      await fetchOne(eventId)
    }

    await fetchManyAnswerForEvent(eventId)

    const answers = answerStore.getManyByEventId(eventId)

    if (answers && answers.length > 0) {
      const missingEmployeeIds = answers
        .map(answer => answer.employeeId)
        .filter(id => id && !employeeStore.isAlreadyInStore(id)) as number[]

      if (missingEmployeeIds && missingEmployeeIds.length > 0) {
        await fetchEmployeesByEventId(eventId)
      }
    }

    const event = eventStore.getOne(eventId)

    if (event) {
      const ids = [event.createdByUserId, event.partnerId]
        .filter(id => id && !userStore.isAlreadyInStore(id)) as number[]

      if (ids && ids.length > 0) {
        await fetchManyUsers(uniq(ids))
      }

      const missingAddressIds = []

      const user = userStore.getOne(event.createdByUserId)
      if (user && user.addressId && !addressStore.isAlreadyInStore(user.addressId)) {
        missingAddressIds.push(user.addressId)
      }

      if (event.addressId && !addressStore.isAlreadyInStore(event.addressId)) {
        missingAddressIds.push(event.addressId)
      }

      employeeStore.getMany(answers
        .map(answer => answer.employeeId)).forEach(emp => missingAddressIds.push(emp.addressId))

      const uniqAddressIds = uniq(missingAddressIds).filter(id => !addressStore.isAlreadyInStore(id))
      if (uniqAddressIds?.length > 0) {
        await fetchManyAddress(uniqAddressIds)
      }

      if (event.filesIds?.length > 0) {
        const missingIds = fileStore.getMissingIds(event.filesIds)

        if (missingIds.length > 0) {
          await fetchManyFiles(missingIds)
        }
      }
    }

    DecLoading()
  }

  async function fetchMany(eventIds: number[]) {
    IncLoading()
    try {
      const ids = eventIds?.length > 1 ? uniq(eventIds) : eventIds
      if (ids?.length > 0) {
        const { data: events } = await $api().get<EventType[]>(`event/manyByIds?ids=${ids.join(',')}`)

        if (events && events.length > 0) {
          storeEventRelationEntities(events)
        }
      }
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
    DecLoading()
  }

  async function fetchDeleted() {
    IncLoading()
    try {
      const { data } = await $api().get<EventType[]>('event/deleted')

      if (data) {
        const missingIds = data.map((event: EventType) => event.id).filter(id => !eventStore.isAlreadyInStore(id))

        if (missingIds.length > 0) {
          const events = data.filter(event => missingIds.includes(event.id))
          storeEventRelationEntities(events)
        }
      }
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
    DecLoading()
  }

  return {
    deleteOne,
    fetchAllEvents,
    fetchDeleted,
    fetchEventsByUser,
    fetchOne,
    fetchMany,
    getEventStatusColor,
    getEventStatusTranslation,
    isEventType,
    patchOne,
    postOne,
    sortEventByDate,
    storeEventRelationEntities,
    fetchEventWithRelations,
  }
}
