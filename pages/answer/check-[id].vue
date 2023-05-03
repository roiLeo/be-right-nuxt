<template>
<div class="h-full">
  <BaseLoader v-if="uiStore.getUIIsLoading" />

  <div
    v-else-if="state.errorMessages?.length === 0"
    class="h-full md:mb-0 md:min-h-full
      bg-fixed bg-center bg-no-repeat bg-cover bg-[url('../../public/static/check-mobile.webp')]
      xl:bg-[url('../../public/static/check-landscap.webp')]
    "
  >
    <div class="h-full px-6 pt-10 mx-auto py-14 sm:py-48 xl:py-52 backdrop-grayscale bg-black/40 xl:flex xl:justify-center">
      <div class="max-w-2xl mx-auto lg:mx-0">
        <h1 class="text-4xl font-bold tracking-tight text-center text-white sm:text-6xl">
          Vous avez un document à signer
        </h1>
        <p class="mt-6 text-lg leading-8 text-center text-gray-300">
          Pour continuer vous devez rentrer le code reçu par email
        </p>

        <Form
          v-slot="{ meta, isSubmitting, errors }"
          class="flex flex-col items-center py-4 mx-auto space-y-4"
          :validation-schema="schema"
          @submit="checkDoubleAuth"
        >
          <BasePinCodeInput
            :digit-count="5"
            name="twoFactorCode"
            wrapper-classes="mx-auto"
          />
          <div class="flex justify-center">
            <BaseButton
              :disabled="!meta.valid || !meta.dirty"
              :is-loading="uiStore.getUIIsLoading || isSubmitting"
              type="submit"
              :title="errors.twoFactorCode || 'Vérifier mon identiter'"
            >
              Vérifier
            </BaseButton>
          </div>
        </Form>
      </div>
    </div>
  </div>

  <BaseMessage
    v-else
    type="danger"
  >
    <div class="space-y-4">
      <p
        v-for="message in state.errorMessages"
        :key="message"
      >
        {{ message }}
      </p>
      <BaseButton :href="{ name: 'index' }">
        Retour
      </BaseButton>
    </div>
  </BaseMessage>
</div>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate'
import { object, string } from 'yup'
import BaseButton from '~/components/Base/BaseButton.vue'
import BasePinCodeInput from '~/components/Base/BasePinCodeInput.vue'
import BaseLoader from '~/components/Base/BaseLoader.vue'
import BaseMessage from '~/components/Base/BaseMessage.vue'
import { useAnswerStore, useEmployeeStore, useEventStore, useUiStore } from '~/store'
import type { ErrorResponse, ResponseAnswerSignature, VeeValidateValues } from '~/types'

const route = useRoute()
const router = useRouter()

const answerStore = useAnswerStore()
const eventStore = useEventStore()
const employeeStore = useEmployeeStore()
const uiStore = useUiStore()
const { IncLoading, DecLoading } = uiStore
const { $toast, $api } = useNuxtApp()
const { getAnswerForSignature } = answerHook()

interface State {
  errorMessages: string[]
}

const state = reactive<State>({
  errorMessages: [],
})

const schema = object({
  twoFactorCode: string()
    .matches(/^[a-zA-Z0-9]+$/, 'Le code doit avoir 5 caractères de chiffres et/ou de lettres')
    .min(5, 'Veuillez remplir les 5 cases')
    .max(5, 'Vous devez remplir 5 cases')
    .required('Le code vérification est obligatoire'),
})

const { query: { email, token } } = route

async function checkDoubleAuth(form: VeeValidateValues) {
  IncLoading()
  try {
    const { data } = await $api().post<{ message: string; status: number }>('answer/checkDoubleAuth', {
      email,
      token,
      twoFactorCode: form.twoFactorCode,
    })

    const paramters = route.params as Record<string, string>

    if (data?.status === 200 && paramters?.id) {
      $toast.success(data.message)
      router.push({
        name: 'answer-show-id',
        params: {
          id: paramters.id,
        },
        query: {
          ...route.query,
        },
      })
    }
  } catch (error) {
    console.error(error)
    $toast.error('Une erreur est survenue')
  }
  DecLoading()
}

onMounted(async () => {
  IncLoading()
  if (!email || !token) {
    router.replace({
      name: 'answer-error',
    })
  } else {
    const res = await getAnswerForSignature({ email: email?.toString(), token: token?.toString() })

    if (res) {
      const { success, data } = res

      if (!success) {
        const error = data as ErrorResponse
        state.errorMessages.push(error.message)
        $toast.error(error.message)
      }
      if (data) {
        const result = data as ResponseAnswerSignature
        if (result.employee) {
          employeeStore.addMany([result.employee])
        }
        if (result.answer) {
          answerStore.addMany([result.answer])
        }
        if (result.event) {
          eventStore.addMany([result.event])
        }
      }
    }
  }
  DecLoading()
})

useHead({
  title: 'Signer un document',
  meta: [
    { name: 'description', content: 'Nou utilisons un code sécurité pour vérifier votre identité' },
  ],
})

definePageMeta({
  layout: 'employee',
})
</script>
