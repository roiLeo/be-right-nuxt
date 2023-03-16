<template>
<div class="lg:border-t lg:border-b lg:border-gray-200">
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
interface Props {
  currentStepIndex: number
}

withDefaults(defineProps<Props>(), {
  currentStepIndex: 0,
})

const steps = [
  { id: '1', name: 'Nouvel évenement', description: 'Créez la date et le contenu de l\'évenement.', query: 'evenement' },
  { id: '2', name: 'Destinataires', description: 'Sélectionnez des destinataires.', query: 'destinataires' },
  { id: '3', name: 'Photographe', description: 'Ajoutez un photographe.', query: 'photographer' },
  { id: '4', name: 'Fin', description: 'Enregistrement de données.', query: 'paiement' },
]
</script>
