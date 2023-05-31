<template>
<div class="w-full h-full px-4 mt-4">
  <Form
    v-slot="{ meta, isSubmitting, values, errors }"
    :validation-schema="schema"
    :initial-values="initialValues"
    class="grid grid-cols-2 gap-4"
    validate-on-mount
    @submit="submit"
  >
    <BaseInput
      label="Prénom"
      name="firstName"
      type="text"
      autocomplete="firstName"
      is-required
    />

    <BaseInput
      label="Nom"
      name="lastName"
      type="text"
      autocomplete="lastName"
      is-required
    />

    <BaseInput
      wrapper-classes="col-span-2"
      label="Adresse email"
      name="email"
      type="email"
      autocomplete="email"
      is-required
    />

    <div
      v-if="!hideRoleSelector"
      class="space-y-2 md:col-span-2"
    >
      <BaseSelect
        label="Rôle de l'utilisateur"
        name="roles"
        :display-value="getRoleTranslation(values.roles) || 'Sélectionner un rôle'"
        placeholder="Choisissez un rôle"
        is-required
      >
        <BaseOption
          v-for="role in [RoleEnum.OWNER, RoleEnum.USER]"
          :key="role"
          :value="role"
          :name="getRoleTranslation(role)"
        />
      </BaseSelect>
    </div>

    <div
      v-if="isDebug"
      class="flex flex-col space-y-2 md:col-span-2"
    >
      <p>Values = {{ values }}</p>
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
import BaseButton from '../Base/BaseButton.vue'
import BaseSelect from '../Base/BaseSelect.vue'
import BaseOption from '../Base/BaseOption.vue'
import BaseInput from '../Base/BaseInput.vue'
import type { UserType, VeeValidateValues } from '@/types'
import { RoleEnum } from '@/types'
import { useUiStore } from '~~/store'

interface Props {
  isDebug?: boolean
  user?: UserType
  hideRoleSelector?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'submit'): void
}>()

const uiStore = useUiStore()
const { IncLoading, DecLoading, resetUiModalState } = uiStore

const { getRoleTranslation, patchOne } = userHook()
const { createNewUser } = companyHook()

const router = useRouter()

const schema = props.hideRoleSelector
  ? object({
    email: string().email('vous devez entrer in email valide').required('L\'adresse email est requise'),
    firstName: string().required('Le prénom est requis'),
    lastName: string().required('Le nom est requis'),
  })
  : object({
    email: string().email('vous devez entrer in email valide').required('L\'adresse email est requise'),
    firstName: string().required('Le prénom est requis'),
    lastName: string().required('Le nom est requis'),
    roles: string()
      .oneOf([RoleEnum.OWNER, RoleEnum.USER], 'Vous devez renseigner un rôle')
      .required('Le rôle est requis'),
  })

const initialValues = {
  email: props.user?.email || '',
  firstName: props.user?.firstName || '',
  lastName: props.user?.lastName || '',
  roles: props.user?.roles || null,
}

async function submit(form: VeeValidateValues) {
  IncLoading()

  if (props.user) {
    await patchOne(props.user.id, form as UserType)
  } else {
    await createNewUser(form as UserType)
  }
  resetUiModalState()
  router.push({
    name: 'mon-compte',
  })
  emit('submit')
  DecLoading()
}
</script>
