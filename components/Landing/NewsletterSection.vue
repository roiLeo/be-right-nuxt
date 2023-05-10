<template>
<section
  id="Newsletter"
  class="flex flex-col items-center py-6 mx-auto mb-8 space-y-4 text-center dark:bg-blue-dark dark:text-white DarkModeAnimation"
>
  <h3 class="text-2xl leading-tight md:text-3xl">
    Restez informé des dernières nouveautés!
  </h3>
  <h4 class="text-gray-500">
    Vous serez prévenu de la sortie de Be Right
  </h4>
  <Form
    v-if="!isSuccess"
    v-slot="{ meta, isSubmitting }"
    :validation-schema="schema"
    class="flex flex-col space-y-4"
    @submit="submit"
  >
    <BaseInput
      type="email"
      name="email"
      autocomplete="email"
      is-required
      placeholder="Votre e-mail"
    />
    <BaseButton
      :disabled="!meta.valid || !meta.dirty || isSubmitting"
      type="submit"
      title="S'abonner à la newletter"
      :is-loading="uiStore.getUIIsLoading || isSubmitting"
    >
      Prévenez-moi
    </BaseButton>
  </Form>
  <BaseMessage
    v-else
    type="success"
  >
    Merci pour votre inscription!
  </BaseMessage>
</section>
</template>

<script setup lang="ts">
import { object, string } from 'yup'
import { Form } from 'vee-validate'
import { useUiStore } from '~~/store'

const { newsletterSignup } = newsletterHook()
const uiStore = useUiStore()
const { IncLoading, DecLoading } = uiStore

const isSuccess = ref(false)

const schema = object({
  email: string().email('vous devez entrer in email valide').required('L\'adresse email est requise'),
})

async function submit(form: any) {
  const { $toast } = useNuxtApp()
  IncLoading()
  await newsletterSignup({
    email: form.email,
    firstName: null,
    lastName: null,
    companyName: null,
  })
  isSuccess.value = true
  $toast.success('Merci pour votre inscription!')
  DecLoading()
}
</script>
