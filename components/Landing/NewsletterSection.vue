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
import BaseButton from '../Base/BaseButton.vue'
import BaseInput from '../Base/BaseInput.vue'
import BaseMessage from '../Base/BaseMessage.vue'
import { useUiStore } from '~~/store'
import type { MailJetContactResponse } from '~/types/Newsletter'

const uiStore = useUiStore()
const { IncLoading, DecLoading } = uiStore

const isSuccess = ref(false)

const schema = object({
  email: string().email('vous devez entrer in email valide').required('L\'adresse email est requise'),
})

async function submit(form: any) {
  const { $toast } = useNuxtApp()
  IncLoading()
  const { data: resDataSuccess } = await useFetch<MailJetContactResponse>('/api/mailjet/addToNewsletter', {
    method: 'post',
    body: [{
      email: form.email,
      IsExcludedFromCampaigns: false,
      Name: '',
    }],
  })
  isSuccess.value = resDataSuccess.value?.status === 201
  if (isSuccess.value) {
    $toast.success('Merci pour votre inscription!')
  } else {
    $toast.denied('Une erreur est survenue!')
  }
  DecLoading()
}
</script>
