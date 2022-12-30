import { defineStore } from 'pinia'
import { createActions, createGetters } from '@malolebrin/pinia-entity-store'
import { baseBugCreationForm, bugState, defaultBugState } from './state'
import type { BugReportCreationFormType, BugReportType } from '@/types'
import { EntitiesEnum } from '@/types'

export const useBugStore = defineStore(EntitiesEnum.BUGS_REPORTS, {
  state: () => ({
    ...bugState,
  }),
  getters: {
    ...createGetters<BugReportType>(bugState),
    getCreationForm: state => state.creationForm,
  },
  actions: {
    // actions common to all entities
    ...createActions<BugReportType>(bugState),

    resetState() {
      this.$state = defaultBugState()
    },

    setCreationForm(payload: BugReportCreationFormType) {
      this.creationForm = payload
    },
    setCreationFormField<K extends keyof BugReportCreationFormType>(field: K, value: BugReportCreationFormType[K]) {
      this.creationForm[field] = value
    },
    resetCreationForm() {
      this.creationForm = baseBugCreationForm
    },
  },
})
