<template>
<Form
  v-slot="{ meta, isSubmitting }"
  :validation-schema="schema"
  class="grid w-full max-w-xl grid-cols-1 gap-6 mt-4 mb-36"
  @submit="submit"
>
  <div class="flex items-center space-x-4">
    <PhotographerComboboxSelector
      name="photographerId"
      :default-values="userStore.getWhereArray(photographer => photographer.roles === RoleEnum.PHOTOGRAPHER)"
      value-key="id"
      wrapper-classes="md:col-span-2 z-20"
      is-required
    />

    <BaseButton
      class="mt-6"
      title="Créer un nouveau photographe"
      @click="toggleCreatePhotographerModal"
    >
      <template #icon>
        <UserPlusIconOutline aria-hidden="true" />
      </template>
    </BaseButton>
  </div>

  <div class="flex items-center justify-center mt-6">
    <BaseButton
      :disabled="!meta.valid || !meta.dirty || isSubmitting"
      :is-loading="uiStore.getUIIsLoading || isSubmitting"
      type="submit"
    >
      <template #icon>
        <ArrowDownOnSquareIconOutline />
      </template>
      valider
    </BaseButton>
  </div>
</Form>
</template>

<script setup lang="ts">
import type { InferType } from 'yup'
import { number, object } from 'yup'
import { Form } from 'vee-validate'
import type { VeeValidateValues } from '@/types'
import { ModalModeEnum, ModalNameEnum, RoleEnum } from '@/types'
import { useUiStore, useUserStore } from '~~/store'

const emit = defineEmits<{
  (e: 'submitted', photographerId: number): void
}>()

const uiStore = useUiStore()
const { setUiModal } = uiStore
const userStore = useUserStore()

const schema = object({
  photographerId: number().required('L\'identifiant de l\'utilisateur est requis'),
})

interface IForm extends InferType<typeof schema> {}

async function submit(form: VeeValidateValues) {
  const formValues = form as IForm
  const { setPhotographerFormField } = userStore
  setPhotographerFormField('photographerId', formValues.photographerId)
  emit('submitted', formValues.photographerId)
}

function toggleCreatePhotographerModal() {
  setUiModal({
    modalName: ModalNameEnum.CREATE_PHOTOGRAPHER,
    modalMode: ModalModeEnum.CREATE,
    isActive: true,
    data: {},
  })
}
</script>
