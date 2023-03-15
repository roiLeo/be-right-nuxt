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
      <li
        v-for="(step, stepIdx) in steps"
        :key="step.id"
        class="relative overflow-hidden lg:flex-1"
      >
        <div
          class="overflow-hidden border border-gray-200 lg:border-0"
          :class="[
            stepIdx === 0 ? 'border-b-0 rounded-t-md' : '',
            stepIdx === steps.length - 1 ? 'border-t-0 rounded-b-md' : '']"
        >
          <div class="group">
            <span
              class="absolute top-0 left-0 w-1 h-full lg:w-full lg:h-1 lg:bottom-0 lg:top-auto"
              :class="isStatusCurrent(stepIdx) ? 'bg-indigo-600' : 'group-hover:bg-gray-200'"
              aria-hidden="true"
            />
            <span
              class="flex items-start px-6 py-5 text-sm font-medium"
              :class="[stepIdx !== 0 ? 'lg:pl-9' : '']"
            >
              <span class="flex-shrink-0">
                <span
                  v-if="isStatusComplete(stepIdx)"
                  class="flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-full"
                >
                  <CheckIconOutline
                    class="w-6 h-6 text-white"
                    aria-hidden="true"
                  />
                </span>
                <span
                  v-else
                  class="flex items-center justify-center w-10 h-10 border-2 rounded-full"
                  :class="isStatusCurrent(stepIdx) ? 'border-indigo-600' : 'border-gray-300'"
                >
                  <span :class="isStatusCurrent(stepIdx) ? 'text-indigo-600' : 'text-gray-500'">{{ step.id }}</span>
                </span>
              </span>
              <span class="mt-0.5 ml-4 min-w-0 flex flex-col">
                <span class="text-xs font-semibold tracking-wide uppercase">{{ step.name }}</span>
                <span class="text-sm font-medium text-gray-500">{{ step.description }}</span>
              </span>
            </span>
          </div>
          <template v-if="stepIdx !== 0">
            <div
              class="absolute inset-0 top-0 left-0 hidden w-3 lg:block"
              aria-hidden="true"
            >
              <svg
                class="w-full h-full text-gray-300"
                viewBox="0 0 12 82"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M0.5 0V31L10.5 41L0.5 51V82"
                  stroke="currentcolor"
                  vector-effect="non-scaling-stroke"
                />
              </svg>
            </div>
          </template>
        </div>
      </li>
    </ol>
  </nav>
</div>
</template>

<script setup lang="ts">
interface Props {
  currentStepIndex: number
}

const props = withDefaults(defineProps<Props>(), {
  currentStepIndex: 0,
})

const steps = [
  { id: '1', name: 'Nouvel évenement', description: 'Créez la date et le contenu de l\'évenement.' },
  { id: '2', name: 'Destinataires', description: 'Sélectionnez des destinataires.' },
  { id: '3', name: 'Photographe', description: 'Ajoutez un photographe.' },
  { id: '4', name: 'Fin', description: 'Enregistrement de données.' },
]

function isStatusComplete(index: number) {
  return props.currentStepIndex > index
}
function isStatusCurrent(index: number) {
  return props.currentStepIndex === index
}
</script>
