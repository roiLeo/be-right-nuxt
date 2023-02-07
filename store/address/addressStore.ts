import { defineStore } from 'pinia'
import { createActions, createGetters } from '@malolebrin/pinia-entity-store'
import { addressState, baseAddressCreationForm, defaultAddressState } from './state'
import type { AddressType, BaseCreationForm } from '@/types'
import { EntitiesEnum } from '@/types'

export const useAddressStore = defineStore(EntitiesEnum.ADDRESS, {
  state: () => ({
    ...addressState,
  }),
  getters: {
    ...createGetters<AddressType>(addressState),
    getOneByEventId: state => (eventId: number) => Object.values(state.entities.byId).filter(address => address.eventId === eventId)[0],
    getOneByEmployeeId: state => (employeeId: number) => Object.values(state.entities.byId).filter(address => address.employeeId === employeeId)[0],
    getCreationForm: state => state.creationForm,
  },
  actions: {
    ...createActions<AddressType>(addressState),

    addOne(address: AddressType) {
      this.entities.byId[address.id] = { ...address, $isDirty: false }
      this.entities.allIds.push(address.id)
    },
    setCreationForm(payload: BaseCreationForm) {
      this.creationForm = payload
    },
    resetCreationForm() {
      this.creationForm = baseAddressCreationForm
    },
    resetState() {
      this.$state = defaultAddressState()
    },
    deleteOneAddress(id: number) {
      delete this.entities.byId[id]
      this.entities.allIds = this.entities.allIds.filter(entityId => entityId !== id)
    },
  },
})
