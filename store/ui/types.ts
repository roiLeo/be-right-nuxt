export enum ModalNameEnum {
  ADD_EMPLOYEE = 'ADD_EMPLOYEE',
  USER_ADMIN = 'USER_ADMIN',
  EVENT_FORM = 'EVENT_FORM',
  FILE_MODAL = 'FILE_MODAL',
}

export enum ModalModeEnum {
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  READ = 'READ',
}

export interface UiState {
  modal: {
    modalName: ModalNameEnum | null
    isActive: boolean
    data: Record<string, any> | null
    modalMode: ModalModeEnum
    isLoading: boolean
  }
  isLoading: number
  isDrawerOpen: boolean
}

export interface ModalOptionsUi {
  modalName: ModalNameEnum
  isActive: boolean
  data: Record<string, any>
  modalMode: ModalModeEnum
}
