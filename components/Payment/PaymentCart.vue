<!-- eslint-disable vue/prefer-separate-static-class -->
<template>
<section
  aria-labelledby="summary-heading"
  class="px-4 py-6 mt-16 rounded-lg bg-gray-50 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
>
  <h2
    id="summary-heading"
    class="text-lg font-medium text-gray-900"
  >
    Votre panier
  </h2>

  <dl class="mt-6 space-y-4">
    <div class="flex items-center justify-between">
      <dt class="text-sm text-gray-600">
        Nombre de destinataires
      </dt>
      <dd class="text-sm font-medium text-gray-900">
        {{ nbRecipient }} / pers.
      </dd>
    </div>
    <div class="flex items-center justify-between pt-4 border-t border-gray-200">
      <dt class="flex items-center text-sm text-gray-600">
        <span>Prix par destinataire</span>
        <a
          href="#"
          class="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-500"
        >
          <span class="sr-only">Learn more about how shipping is calculated</span>
          <QuestionMarkCircleIconOutline
            class="w-5 h-5"
            aria-hidden="true"
          />
        </a>
      </dt>
      <dd class="text-sm font-medium text-gray-900">
        1.00€
      </dd>
    </div>
    <div class="flex items-center justify-between pt-4 border-t border-gray-200">
      <dt class="text-base font-medium text-gray-900">
        Montant total
      </dt>
      <dd class="text-base font-medium text-gray-900">
        {{ nbRecipient * 1 }}€
      </dd>
    </div>
  </dl>

  <div class="mt-6">
    <button
      type="button"
      :disabled="!isSubmitEnabled || uiStore.getUIIsLoading"
      class="w-full px-4 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm"
      :class="[
        'hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50',
        isSubmitEnabled ? '' : 'disabled:cursor-not-allowed disabled:opacity-50',
      ]"
      @click="checkout"
    >
      <div
        v-if="uiStore.getUIIsLoading"
        class="flex items-center justify-center w-full h-full"
      >
        <svg
          class="w-6 h-6 text-white-600 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      <span v-else>Payer</span>
    </button>
  </div>
</section>
</template>

<script setup lang="ts">
import { useFormStore, useUiStore } from '~~/store'

interface Props {
  nbRecipient: number
}

withDefaults(defineProps<Props>(), {
  nbRecipient: 0,
})

const emit = defineEmits(['checkout'])

const uiStore = useUiStore()
const formStore = useFormStore()
const { submitCreationEvent } = eventFormHook()

const isSubmitEnabled = computed(() => formStore.isStepPhotographerValid && formStore.isStepEventValid && formStore.isStepEmployeeValid)

async function checkout() {
  await submitCreationEvent()
  emit('checkout')
}
</script>
