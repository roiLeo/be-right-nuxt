<template>
<Form
  v-slot="{ meta, isSubmitting }"
  :validation-schema="schema"
  :initial-values="initialValues"
  class="grid max-w-3xl grid-cols-1 gap-4 mt-4 mb-36"
  @submit="submit"
>
  <EmployeeComboboxSelector
    name="employees"
    :default-values="authStore.isAuthUserAdmin ? employeeStore.getAllArray : employeeStore.getEmployeesByUserId(userStore.getAuthUserId!)"
    value-key="id"
    wrapper-classes="md:col-span-2"
    is-required
  />
  <div class="flex items-center justify-center mt-6 md:col-span-3">
    <BaseButton
      :disabled="!meta.valid || !meta.dirty"
      :is-loading="uiStore.getUIIsLoading || isSubmitting"
      type="submit"
    >
      <template #icon>
        <ArrowDownOnSquareIconOutline />
      </template>
      Enregistrer
    </BaseButton>
  </div>
</Form>
</template>

<script setup lang="ts">
import { array, number, object } from 'yup'
import { Form } from 'vee-validate'
import {
  useAuthStore,
  useEmployeeStore,
  useEventStore,
  useUiStore,
  useUserStore,
} from '~~/store'
import type { VeeValidateValues } from '~~/types'

const employeeStore = useEmployeeStore()
const { setCreationFormField } = useEventStore()
const uiStore = useUiStore()
const { IncLoading, DecLoading, resetUiModalState } = uiStore
const authStore = useAuthStore()
const userStore = useUserStore()
const router = useRouter()

const schema = object({
  employees: array().of(number()).min(1, 'Sélectionnez au moins un destinataire')
    .required('Les destinataires sont obligatoire'),
})

const initialValues = {
  employees: [],
}

async function submit(form: VeeValidateValues) {
  IncLoading()
  setCreationFormField('employeeIds', form.employees)
  router.push({
    name: 'evenement-create',
    query: { step: 'photographer' },
  })
  DecLoading()
  resetUiModalState()
}
</script>
