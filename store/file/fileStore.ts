import { defineStore } from 'pinia'
import { createActions, createGetters } from '@malolebrin/pinia-entity-store'
import { defaultFileState, fileState } from './state'
import type { FileType } from './types'
import { EntitiesEnum } from '@/types/globals'

export const useFileStore = defineStore(EntitiesEnum.FILES, {
  state: () => ({
    ...fileState,
  }),
  actions: {
    // actions common to all entities
    ...createActions<FileType>(fileState),

    resetState() {
      this.$state = defaultFileState()
    },
  },
  getters: {
    ...createGetters<FileType>(fileState),
  },
})
