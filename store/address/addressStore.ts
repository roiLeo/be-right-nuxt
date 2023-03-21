import { defineStore } from 'pinia'
import { createActions, createGetters } from '@malolebrin/pinia-entity-store'
import { addressState, defaultAddressState } from './state'
import type { AddressType } from '@/types'
import { EntitiesEnum } from '@/types'

export const useAddressStore = defineStore(EntitiesEnum.ADDRESS, {
  state: () => ({
    ...addressState,
  }),
  getters: {
    ...createGetters<AddressType>(addressState),
  },
  actions: {
    ...createActions<AddressType>(addressState),

    addOne(address: AddressType) {
      this.entities.byId[address.id] = { ...address, $isDirty: false }
      this.entities.allIds.push(address.id)
    },

    addMany(addresses: AddressType[]) {
      addresses.forEach(address => {
        this.entities.byId[address.id] = { ...address, $isDirty: false }
        this.entities.allIds.push(address.id)
      })
    },

    updateOneAddress(id: number, data: Partial<AddressType>) {
      if (this.entities.byId[id] !== null || this.entities.byId[id] !== undefined) {
        this.entities.byId[id] = {
          ...this.entities.byId[id],
          ...data,
        }
      }
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
