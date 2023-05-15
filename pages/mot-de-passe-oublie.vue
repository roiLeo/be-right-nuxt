<template>
<Form
  v-slot="{ meta, isSubmitting }"
  :validation-schema="schema"
  :initial-values="{ email: '' }"
  class="container flex justify-center min-h-screen px-8 py-8 mx-auto mt-32"
  @submit="onSubmit"
>
  <div class="flex flex-col space-y-12 text-center">
    <div class="mb-26">
      <LogoSimpleLogo />
      <h1 class="text-black dark:text-white">
        Récupération de mot de passe
      </h1>
    </div>

    <BaseInput
      label="Adresse email"
      name="email"
      type="email"
      autocomplete="email"
      is-required
    />

    <FormApiMessage
      :message="state.successMessage"
      :errors="state.submissionErrors"
      :is-success="state.isSuccess"
    />

    <div class="flex flex-col items-center justify-center space-y-6">
      <BaseButton
        :disabled="!meta.valid || !meta.dirty || isSubmitting"
        :is-loading="uiStore.getUIIsLoading || isSubmitting"
        type="submit"
      >
        Réinitialiser le mot de passe
      </BaseButton>
      <NuxtLink
        class="LinkClass"
        :to="{ name: 'register' }"
      >
        Je n'ai pas de compte
      </NuxtLink>
      <NuxtLink
        class="LinkClass"
        :to="{ name: 'login' }"
      >
        J'ai déjà un compte
      </NuxtLink>
    </div>
  </div>
</Form>
</template>

<script setup lang="ts">
import { object, string } from 'yup'
import { Form } from 'vee-validate'
import type { ResetPasswordData, VeeValidateValues } from '@/types'
import { useUiStore } from '~/store/ui/uiStore'

const uiStore = useUiStore()
const { IncLoading, DecLoading } = uiStore

const schema = object({
  email: string().email('vous devez entrer in email valide').required('L\'adresse email est requise'),
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

async function onSubmit(form: VeeValidateValues) {
  const { $toast, $api } = useNuxtApp()
  IncLoading()
  resetState()
  try {
    const { data } = await $api().post<ResetPasswordData>('auth/forgot-password', form)
    if (data) {
      const response = data
      if (response.isSuccess) {
        state.isSuccess = true
      }
      state.successMessage = response.message
    }
  } catch (error: any) {
    state.submissionErrors.push(error.response.data.error)
    $toast.danger('Une erreur est survenue')
  } finally {
    DecLoading()
  }
}

definePageMeta({ layout: 'default' })
</script>
