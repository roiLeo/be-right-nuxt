<template>
<div class="w-full h-full px-4 mt-4">
  <Form
    v-slot="{ meta, isSubmitting, errors }"
    :validation-schema="schema"
    :initial-values="initialValues"
    class="grid grid-cols-2 gap-4"
    @submit="submit"
  >
    <BaseInput
      label="Nom"
      name="name"
      type="text"
      autocomplete="name"
      is-required
    />

    <BaseInput
      label="Numéro siret"
      name="siret"
      type="text"
      autocomplete="siret"
    />

    <div
      v-if="isDebug"
      class="flex flex-col space-y-2 md:col-span-2"
    >
      <p>is Dirty = {{ meta.dirty }}</p>
      <p>is valid = {{ meta.valid }}</p>
      <p
        v-for="error in errors"
        :key="error"
      >
        {{ error }}
      </p>
    </div>

    <div class="flex items-center justify-center mt-6 md:col-span-2">
      <BaseButton
        :disabled="!meta.valid || !meta.dirty || isSubmitting"
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
</div>
</template>

<script setup lang="ts">
import { object, string } from 'yup'
import { Form } from 'vee-validate'
import type { VeeValidateValues } from '@/types'
import type { Company } from '~~/store'
import { useUiStore } from '~~/store'

interface Props {
  isDebug?: boolean
  company?: Company
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'submit'): void
}>()

const uiStore = useUiStore()
const { IncLoading, DecLoading, resetUiModalState } = uiStore

const { patchOne } = companyHook()

const router = useRouter()

const schema = object({
  name: string().required('Le nom est requis'),
  siret: string().nullable('Le siret n\'est pas obligatoire'),
})

const initialValues = {
  name: props.company?.name || '',
  siret: props.company?.siret || '',
}

async function submit(form: VeeValidateValues) {
  IncLoading()

  if (props.company) {
    await patchOne(props.company.id, form)
  }
  resetUiModalState()
  router.push({
    name: 'mon-compte',
  })
  emit('submit')
  DecLoading()
}
</script>
