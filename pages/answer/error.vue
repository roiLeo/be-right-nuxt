<template>
<section class="grid min-h-full px-6 py-24 bg-white place-items-center sm:py-32 lg:px-8">
  <div class="text-center">
    <div class="flex justify-center">
      <ExclamationTriangleIcon class="w-12 h-12 text-red-500" />
    </div>
    <h1 class="mt-4 mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
      Il semberait y avoir une erreur
    </h1>
    <p class="mt-6 text-base leading-7 text-gray-600">
      Veuillez réssayer en cliquant sur le boutton dans l'email qui vous à été envoyé ou contacter son émetteur.
    </p>
    <div class="flex items-center justify-center mt-10 gap-x-6">
      <BaseButton
        color="purple"
        :href="{ name: 'index' }"
      >
        Retour à l'accueil
      </BaseButton>
    </div>
  </div>
</section>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import BaseButton from '~/components/Base/BaseButton.vue'

definePageMeta({
  layout: 'employee',
})
</script>
