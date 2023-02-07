<template>
<Form
  v-slot="{ meta, isSubmitting, values }"
  :validation-schema="schema"
  class="grid w-full grid-cols-1 gap-6 mt-4 mb-36"
  @submit="submit"
>
  <BaseSelect
    label="Choissiez un photographe"
    name="photographerId"
    placeholder="Choisissez un photographe"
    :display-value="getUserfullName(userStore.getOne(values.photographerId))"
    is-required
  >
    <BaseOption
      v-for="user in state.allPhotographer"
      :key="user.id"
      :value="user.id"
      :name="getUserfullName(user)"
    />
    <BaseOption
      value="null"
      name="Aucun"
    />
  </BaseSelect>
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
import type { UserType, VeeValidateValues } from '@/types'
import { RoleEnum } from '@/types'
import { useAuthStore, useUiStore, useUserStore } from '~~/store'

const emit = defineEmits<{
  (e: 'submitted', photographerId: number): void
}>()
const uiStore = useUiStore()
const userStore = useUserStore()
const authstore = useAuthStore()

const { getUserfullName, fetchAll, getPhotographerUserWorkedWith } = userHook()

const schema = object({
  photographerId: number().required('L\'identifiant de l\'utilisateur est requis'),
})

interface State {
  allPhotographer: UserType[]
  isLoading: boolean
}

interface IForm extends InferType<typeof schema> {}

const state = reactive<State>({
  allPhotographer: [],
  isLoading: false,
})

async function submit(form: VeeValidateValues) {
  const formValues = form as IForm
  emit('submitted', formValues.photographerId)
}

onMounted(async () => {
  state.isLoading = true
  if (authstore.isAuthUserAdmin) {
    await fetchAll()
    state.allPhotographer = userStore.getWhereArray(photographer => photographer.roles === RoleEnum.PHOTOGRAPHER)
  } else if (userStore.getAuthUserId) {
    const res = await getPhotographerUserWorkedWith(userStore.getAuthUserId)
    state.allPhotographer = res
  }
  state.isLoading = false
})
</script>
