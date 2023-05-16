import { defineStore } from 'pinia'
import { uniq } from '@antfu/utils'
import {
  baseAddressCreationForm,
  baseEventCreationForm,
  basePhotographerForm,
  createForm,
  defaultFormState,
  formState,
} from './state'
import type {
  BaseAddressCreationForm,
  BaseEventFormType,
  BasePhotographerForm,
  PhotographerCreatePayload,
} from './types'
import { FormEnum } from './types'

export const useFormStore = defineStore('form', {
  state: () => ({ ...formState }),

  getters: {
    getFormState: state => (type: FormEnum) => {
      switch (type) {
        case FormEnum.ADDRESS_FORM:
          return state.addressForm as BaseAddressCreationForm
        case FormEnum.EVENT_FORM:
          return state.eventform as BaseEventFormType
        case FormEnum.PHOTOGRAPHER_FORM:
          return state.photographerForm as PhotographerCreatePayload
      }
    },

    getPhotographerId: state => state.photographerForm.photographerId,
    getEmployeeIds: state => state.eventform.employeeIds,

    isFormDirty: state => (type: FormEnum) => {
      switch (type) {
        case FormEnum.ADDRESS_FORM:
          return state.addressForm.isDirty
        case FormEnum.EVENT_FORM:
          return state.eventform.isDirty
        case FormEnum.PHOTOGRAPHER_FORM:
          return state.photographerForm.isDirty
      }
    },

    isStepEventValid: state => {
      const { addressLine, city, country, postalCode } = state.addressForm
      const { name, start, end } = state.eventform
      return isTruthy(name)
        && isTruthy(start)
        && isTruthy(end)
        && isTruthy(addressLine)
        && isTruthy(city)
        && isTruthy(country)
        && isTruthy(postalCode)
    },

    isStepEmployeeValid: state => state.eventform.employeeIds?.length > 0,

    isStepPhotographerValid: state => {
      const { firstName, lastName, email, photographerId } = state.photographerForm
      return (
        (isTruthy(firstName)
          && isTruthy(lastName)
          && isTruthy(email))
        || isTruthy(photographerId))
    },

    isNewPhotographerValid: state => {
      const { firstName, lastName, email } = state.photographerForm
      return isTruthy(firstName)
        && isTruthy(lastName)
        && isTruthy(email)
    },

    isSelectedPhotographerValid: state => isTruthy(state.photographerForm.photographerId),
  },

  actions: {
    setFormDirty(type: FormEnum) {
      switch (type) {
        case FormEnum.ADDRESS_FORM:
          return this.addressForm.isDirty = true
        case FormEnum.EVENT_FORM:
          return this.eventform.isDirty = true
        case FormEnum.PHOTOGRAPHER_FORM:
          return this.photographerForm.isDirty = true
      }
    },

    setAddressForm(data: Partial<BaseAddressCreationForm>) {
      this.addressForm = {
        ...this.addressForm,
        ...data,
        isDirty: true,
      }
    },

    setEventForm(data: Partial<BaseEventFormType>) {
      this.eventform = {
        ...this.eventform,
        ...data,
        isDirty: true,
      }
    },

    setEmployeeIds(ids: number[]) {
      this.eventform.employeeIds = ids
    },

    mergeEmployeeIds(ids: number[]) {
      this.eventform.employeeIds = uniq([
        ...this.eventform.employeeIds,
        ...ids,
      ])
    },

    removeEmployeeIds(ids: number[]) {
      this.eventform.employeeIds = this.eventform.employeeIds.filter(id => !ids.includes(id))
    },

    setPhotographerId(id: number) {
      this.photographerForm.photographerId = id
    },

    setPhotographerForm(data: Partial<BasePhotographerForm>) {
      this.photographerForm = {
        ...this.photographerForm,
        ...data,
        isDirty: true,
      }
    },

    resetForm(type: FormEnum) {
      switch (type) {
        case FormEnum.ADDRESS_FORM:
          return this.addressForm = createForm(baseAddressCreationForm)
        case FormEnum.EVENT_FORM:
          return this.eventform = createForm(baseEventCreationForm)
        case FormEnum.PHOTOGRAPHER_FORM:
          return this.photographerForm = createForm(basePhotographerForm)
      }
    },

    resetState() {
      this.$state = defaultFormState()
    },
  },
  persist: true,
})
