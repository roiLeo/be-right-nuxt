import { hasOwnProperty } from '@antfu/utils'
import { isArrayOfNumbers, noNull } from '@/utils'
import { useAddressStore, useEventStore, useUiStore } from '~~/store'
import type { EmployeeType, EventCreatePayload, EventType, EventTypeWithRelations, PaginatedResponse } from '~~/types'
import { EventStatusEnum, getEventStatusTranslationEnum } from '~~/types'

export default function eventHook() {
  const { $toast, $api } = useNuxtApp()

  const eventStore = useEventStore()
  const { isUserType } = userHook()
  const { isAddressType } = addressHook()
  const { DecLoading, IncLoading } = useUiStore()
  const addressStore = useAddressStore()
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
        if (address && isAddressType(address)) {
          if (!addressStore.isAlreadyInStore(address?.id)) {
            createOneAddress(address)
            delete event.address
          }
        }
        return {
          ...event,
        }
      })
      eventStore.createMany(eventsToStore)
      return eventsToStore
    }
    return []
  }

  function getSignatureCount(employees: EmployeeType[]) {
    if (employees && employees.length) {
      return employees.filter(employee => noNull(employee.signedAt)).length
    }
    return 0
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

  async function fetchEvent(id: number) {
    IncLoading()
    try {
      const { data } = await $api().get<EventType>(`event/${id}`)
      if (data && !eventStore.isAlreadyInStore(data.id) && isEventType(data)) {
        storeEventRelationEntities([data])
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
            const eventToStore = events.map(event => ({
              ...event,
              createdByUser: userId,
            }))
            storeEventRelationEntities(eventToStore)
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
      const { userId } = payload
      const { data } = await $api().post<EventType>(`event/${userId}`, payload)

      if (data) {
        const eventToStore = data
        if (isUserType(data.createdByUser)) {
          eventToStore.createdByUser = data.createdByUser.id
        }
        eventStore.createOne(eventToStore)
        $toast.success('L\'événement a été créé avec succès')
        return eventToStore
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
        delete event.address
        delete event.partnerId
        const res = await $api().patch(`event/${event.id}`, { event })
        if (isEventType(res)) {
          eventStore.updateOne(res.id, res)
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
      await $api().delete(`event/${id}`)
      eventStore.deleteOne(id)
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

  function isEventTypeArray(events: any[]): events is EventType[] {
    return events.every(isEventType)
  }

  function isEventWithRelations(event: any): event is EventTypeWithRelations {
    if (isEventType(event) && event.employees?.length) {
      return !isArrayOfNumbers(event.employees)
    } else
      return false
  }

  return {
    deleteOne,
    fetchAllEvents,
    fetchEvent,
    fetchEventsByUser,
    fetchOne,
    getEventStatusColor,
    getEventStatusTranslation,
    getSignatureCount,
    isEventType,
    isEventTypeArray,
    isEventWithRelations,
    patchOne,
    postOne,
    sortEventByDate,
    storeEventRelationEntities,
  }
}
