<template>
<Form
  v-slot="{ meta, isSubmitting, errors }"
  :validation-schema="validationSchema"
  :initial-values="initialValues"
  class="grid w-full max-w-xl grid-cols-1 gap-6 mt-4 md:grid-cols-2"
  @submit="submit"
>
  <BaseInput
    wrapper-classes="md:col-span-2"
    label="Nom du groupe"
    name="name"
    autocomplete="name"
    is-required
  />

  <BaseTextarea
    class="md:col-span-2"
    label="Description du groupe"
    name="description"
    autocomplete="description"
  />

  <EmployeeComboboxSelector
    name="employeeIds"
    :default-values="employeeStore.getAllArray"
    value-key="id"
    wrapper-classes="md:col-span-2"
    is-required
  />

  <BaseFormDebug
    v-if="isDebug"
    class="md:col-span-2"
    :errors="errors"
    :meta="meta"
  />

  <div class="flex items-center justify-center mt-6 md:col-span-2">
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
import { Form } from 'vee-validate'
import { array, number, object, string } from 'yup'
import { useEmployeeStore, useUiStore, useUserStore } from '~~/store'
import type { VeeValidateValues } from '~~/types'

interface Props {
  isDebug?: boolean
}

defineProps<Props>()

const uiStore = useUiStore()
const employeeStore = useEmployeeStore()

const { postOne } = groupHook()
const { fetchOne } = companyHook()
const userStore = useUserStore()

const validationSchema = computed(() => {
  return object({
    name: string().required('le nom de l\'événement est obligatoire'),
    description: string().nullable(),
    employeeIds: array(number())
      .min(1, 'Sélectionnez au moins un destinataire')
      .required('Les destinataires sont requis'),
  })
})

const initialValues = {
  name: null,
  description: null,
  employeeIds: [],
  file: null,
}

async function submit(form: VeeValidateValues) {
  const router = useRouter()

  await postOne({
    name: form.name,
    description: form.description,
    employeeIds: form.employeeIds,
  })

  if (userStore.getAuthUser?.companyId) {
    await fetchOne(userStore.getAuthUser?.companyId)
  }

  router.push({
    name: 'groupe',
  })
}
</script>
