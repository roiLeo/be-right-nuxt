<template>
<Form
  v-slot="{ meta, isSubmitting }"
  :validation-schema="schema"
  :initial-values="{
    password: '',
    passwordConfirmation: '',
  }"
  class="flex items-center justify-center lg:container"
  @submit="onSubmit"
>
  <div class="flex flex-col space-x-12 space-y-12 md:max-w-lg">
    <div class="space-y-4 mb-26">
      <LogoSimpleLogo />
      <h1 class="text-black dark:text-white">
        Connectez vous sur
      </h1>
    </div>

    <div class="space-y-4">
      <BaseInput
        label="Mot de passe"
        name="password"
        type="password"
        autocomplete="current-password"
        is-required
      />

      <BaseInput
        label="Confirmation de Mot de passe"
        name="passwordConfirmation"
        type="password"
        autocomplete="password_confirmation"
        is-required
      />
    </div>

    <FormApiMessage
      :message="state.successMessage"
      :errors="state.submissionErrors"
      :is-success="state.isSuccess"
    />

    <div class="flex flex-col items-center justify-center space-y-6">
      <BaseButton
        :disabled="!meta.valid || !meta.dirty || isSubmitting || (!query.email || !query.token)"
        :is-loading="uiStore.getUIIsLoading || isSubmitting"
        type="submit"
      >
        Réinitialiser le mot de passe
      </BaseButton>
    </div>
  </div>
</Form>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate'
import { object, ref as reference, string } from 'yup'
import type { ResetPasswordData, VeeValidateValues } from '@/types'
import { useUiStore } from '~/store/ui/uiStore'
import { RouteNames } from '~/helpers/routes'
import { passwordRegex } from '~/helpers/regex'

const uiStore = useUiStore()
const { IncLoading, DecLoading } = uiStore
const { query } = useRoute()
const router = useRouter()

const schema = object({
  password: string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caratères')
    .required('Le mot de passe est requis')
    .matches(
      passwordRegex,
      'Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial',
    ),
  passwordConfirmation: string()
    .oneOf([reference('password')], 'Les mots de passe sont différents')
    .min(8, 'Le mot de passe doit contenir au moins 8 caratères')
    .required('Confirmez votre nouveau mot de passe')
    .matches(
      passwordRegex,
      'Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial',
    ),
})

interface State {
  submissionErrors: string[]
  successMessage: string | null
  isSuccess: boolean
}

const state = reactive<State>({
  submissionErrors: [],
  successMessage: null,
  isSuccess: false,
})

function resetState() {
  state.submissionErrors = []
  state.successMessage = null
  state.isSuccess = false
}

onMounted(() => {
  if (!query.email || !query.token) {
    state.submissionErrors.push('Des paramètres sont manquant')
  }
})

async function onSubmit(form: VeeValidateValues) {
  const { $api, $toast } = useNuxtApp()

  IncLoading()
  resetState()
  try {
    const { data } = await $api().post<ResetPasswordData>('auth/reset-password', {
      email: query.email,
      password: form.password,
      password_confirmation: form.passwordConfirmation,
      twoFactorRecoveryCode: query.token,
    })

    if (data) {
      state.successMessage = data.message

      if (data.isSuccess) {
        state.isSuccess = true
        router.replace({
          name: RouteNames.LOGIN,
        })
      }
    }
  } catch (error: any) {
    state.submissionErrors.push(error.response.data.error)
    $toast.error('Une erreur est survenue')
  } finally {
    DecLoading()
  }
}

definePageMeta({ layout: 'default' })
</script>
