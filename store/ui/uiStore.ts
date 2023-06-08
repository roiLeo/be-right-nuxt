import { defineStore } from 'pinia'
import { defaultUiState, uiState } from './state'
import type { ModalNameEnum, ModalOptionsUi } from './types'
import { ModalModeEnum } from './types'
import { EntitiesEnum } from '@/types'

export const useUiStore = defineStore(EntitiesEnum.UI, {
  state: () => ({ ...uiState }),
  getters: {
    getUIState: state => state,
    getUiModalState: state => state.modal,
    getUIIsLoading: state => state.isLoading > 0,
    getUiModalData: state => state.modal.data,
    getIsDrawerOpen: state => state.isDrawerOpen,

    isModalActive: state => {
      return (modalName: ModalNameEnum) => state.modal.isActive
        && state.modal.modalName === modalName
        && !state.modal.isLoading
    },
  },
  actions: {
    resetUIState() {
      this.$state = defaultUiState()
    },
    IncLoading() {
      this.isLoading++
    },
    DecLoading() {
      this.isLoading--
    },
    resetLoading() {
      this.isLoading = 0
    },
    setUiModal(options: ModalOptionsUi) {
      this.modal.modalName = options.modalName
      this.modal.isActive = options.isActive
      this.modal.data = options.data
      this.modal.modalMode = options.modalMode
    },
    resetUiModalState() {
      this.modal.modalName = null
      this.modal.isActive = false
      this.modal.data = null
      this.modal.modalMode = ModalModeEnum.READ
      this.modal.isLoading = false
    },
    toggleDrawer() {
      this.isDrawerOpen = !this.isDrawerOpen
    },
    closeDrawer() {
      this.isDrawerOpen = false
    },
    openDrawer() {
      this.isDrawerOpen = true
    },
  },
})
