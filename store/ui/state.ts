import type { UiState } from './types'
import { ModalModeEnum } from './types'

export const uiState: UiState = defaultUiState()

export function defaultUiState() {
  return {
    modal: {
      modalName: null,
      isActive: false,
      data: null,
      modalMode: ModalModeEnum.READ,
      isLoading: false,
    },
    isLoading: 0,
    isDrawerOpen: false,
  }
}
