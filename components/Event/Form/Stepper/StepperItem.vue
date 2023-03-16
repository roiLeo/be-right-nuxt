<template>
<NuxtLink
  class="relative overflow-hidden lg:flex-1"
  :class="[
    stepIdx === stepsLength - 1 ? 'cursor-not-allowed' : '',
  ]"
  :to="{
    query: {
      step: stepIdx === stepsLength - 1 ? $route.query.step : step.query,
    },
  }"
>
  <div
    class="overflow-hidden border border-gray-200 lg:border-0"
    :class="[
      stepIdx === 0 ? 'border-b-0 rounded-t-md' : '',
      stepIdx === stepsLength - 1 ? 'border-t-0 rounded-b-md' : '']"
  >
    <div class="group">
      <span
        class="absolute top-0 left-0 w-1 h-full lg:w-full lg:h-1 lg:bottom-0 lg:top-auto"
        :class="isStatusCurrent(stepIdx) ? 'bg-indigo-600' : 'group-hover:bg-gray-200'"
        aria-hidden="true"
      />
      <span
        class="flex items-start px-2 py-2 text-sm font-medium lg:px-4"
        :class="[stepIdx !== 0 ? 'lg:pl-7' : '']"
      >
        <span class="flex-shrink-0">
          <span
            v-if="isStepCompleted(stepIdx) && isStepPassed(stepIdx)"
            class="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-full lg:w-10 lg:h-10"
          >
            <CheckIconOutline
              class="w-6 h-6 text-white"
              aria-hidden="true"
            />
          </span>

          <span
            v-else-if="isStepPassed(stepIdx) && !isStepCompleted(stepIdx)"
            class="flex items-center justify-center w-8 h-8 bg-orange-600 rounded-full lg:w-10 lg:h-10"
          >
            <ExclamationCircleIconOutline
              class="w-6 h-6 text-white"
              aria-hidden="true"
            />
          </span>

          <span
            v-else
            class="flex items-center justify-center w-8 h-8 border-2 rounded-full lg:w-10 lg:h-10"
            :class="isStatusCurrent(stepIdx) ? 'border-indigo-600' : 'border-gray-300'"
          >
            <span :class="isStatusCurrent(stepIdx) ? 'text-indigo-600' : 'text-gray-500'">{{ step.id }}</span>
          </span>
        </span>

        <span class="mt-0.5 ml-4 min-w-0 flex flex-col">
          <span class="text-xs font-semibold tracking-wide uppercase">{{ step.name }}</span>
          <span
            v-if="isStepPassed(stepIdx) && !isStepCompleted(stepIdx)"
            class="text-xs font-light text-orange-500"
          >Vous n'avez pas rempli cette étape</span>
          <span
            v-else
            class="text-xs font-light text-gray-500"
          >{{ step.description }}</span>
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
</NuxtLink>
</template>

<script setup lang="ts">
import { useAddressStore, useEventStore, useUserStore } from '~~/store'

interface Props {
  currentStepIndex: number
  step: {
    id: string
    name: string
    description: string
    query: string
  }
  stepIdx: number
  stepsLength: number
}

const props = withDefaults(defineProps<Props>(), {
  currentStepIndex: 0,
})

const eventStore = useEventStore()
const addressStore = useAddressStore()
const userStore = useUserStore()

function isStepPassed(index: number) {
  return props.currentStepIndex > index
}

function isStepCompleted(index: number) {
  const { name, start, end } = eventStore.getCreationForm
  const { addressLine, city, country, postalCode } = addressStore.getCreationForm

  if (index === 0) {
    return name
      && start
      && end
      && addressLine
      && city
      && country
      && postalCode
  }

  if (index === 1) {
    return eventStore.getCreationForm.employeeIds?.length > 0
  }

  if (index === 2) {
    const { firstName, lastName, email, photographerId } = userStore.photographerForm
    return (
      (firstName
        && lastName
        && email)
        || photographerId)
  }

  return true
}

function isStatusCurrent(index: number) {
  return props.currentStepIndex === index
}
</script>
