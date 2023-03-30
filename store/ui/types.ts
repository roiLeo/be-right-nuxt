export enum ModalNameEnum {
  ADD_EMPLOYEE = 'ADD_EMPLOYEE',
  USER_ADMIN = 'USER_ADMIN',
  EVENT_FORM = 'EVENT_FORM',
  FILE_MODAL = 'FILE_MODAL',
  DOWNLOAD_ANSWER = 'DOWNLOAD_ANSWER',
  ADD_RECIPIENT_TO_GROUP = 'ADD_RECIPIENT_TO_GROUP',
  ADD_RECIPIENT_TO_EVENT = 'ADD_RECIPIENT_TO_EVENT',
  DELETE_CONFIRM_GROUP = 'DELETE_CONFIRM_GROUP',
  CREATE_PHOTOGRAPHER = 'CREATE_PHOTOGRAPHER',
  CREATE_USER = 'CREATE_USER',
}

export enum ModalModeEnum {
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  READ = 'READ',
  DOWNLOAD = 'DOWNLOAD',
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
