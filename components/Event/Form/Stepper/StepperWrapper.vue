<template>
<div class="lg:sticky lg:z-20 lg:bg-white top-16 lg:border-t lg:border-b lg:border-gray-200">
  <nav
    class="mx-auto max-w-7xl"
    aria-label="Progress"
  >
    <ol
      role="list"
      class="overflow-hidden rounded-md lg:flex lg:border-l lg:border-r lg:border-gray-200 lg:rounded-none"
    >
      <EventFormStepperItem
        v-for="(step, stepIdx) in steps"
        :key="step.id"
        :step="step"
        :step-idx="stepIdx"
        :steps-length="steps.length"
        :current-step-index="currentStepIndex"
      />
    </ol>
  </nav>
</div>
</template>

<script setup lang="ts">
import { RouteNames } from '~~/helpers/routes'

const steps = [
  { id: '1', name: 'Nouvel évenement', description: 'Créez la date et le contenu de l\'évenement.', query: 'evenement', pathName: RouteNames.CREATE_EVENT_STEP_1 },
  { id: '2', name: 'Destinataires', description: 'Sélectionnez des destinataires.', query: 'destinataires', pathName: RouteNames.CREATE_EVENT_STEP_2 },
  { id: '3', name: 'Photographe', description: 'Ajoutez un photographe.', query: 'photographer', pathName: RouteNames.CREATE_EVENT_STEP_3 },
  { id: '4', name: 'Fin', description: 'Enregistrement de données.', query: 'paiement', pathName: RouteNames.CREATE_EVENT_STEP_PAYMENT },
]

const { currentStepIndex } = eventFormHook()
</script>
