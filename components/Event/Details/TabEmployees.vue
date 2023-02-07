<template>
<ul
  role="list"
  class="mt-5 border-t border-gray-200 divide-y divide-gray-200 sm:mt-0 sm:border-t-0"
>
  <li
    v-for="employee in employees"
    :key="employee.id"
  >
    <NuxtLink
      :to="{
        name: 'destinataire-show-id',
        params: {
          id: employee.id,
        },
      }"
      class="block group"
      :data-cy="`event-details-employee-link-${employee.id}`"
    >
      <div class="flex items-center px-4 py-5 sm:py-6 sm:px-0">
        <div class="flex items-center flex-1 min-w-0">
          <div class="flex-1 min-w-0 px-4 md:grid md:grid-cols-2 md:gap-4">
            <div>
              <p
                :data-cy="`event-details-employee-name-${employee.id}`"
                class="text-sm font-medium text-purple-600 truncate"
              >
                {{ employee.firstName }}
                {{ employee.lastName }}
              </p>
              <p class="flex items-center mt-2 text-sm text-gray-500">
                <EnvelopeIconOutline
                  class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <span class="truncate">{{ employee.email }}</span>
              </p>
              <p class="flex items-center mt-2 text-sm text-gray-500">
                <PhoneIconOutline
                  class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <span class="truncate">{{ employee.phone }}</span>
              </p>
            </div>
            <div
              v-if="getAnswerForEmployee(employee.id).value?.createdAt"
              class="hidden md:block"
            >
              <AnswerResponseAction :answer="getAnswerForEmployee(employee.id).value" />
            </div>
          </div>
        </div>
      </div>
    </NuxtLink>
  </li>
</ul>
</template>

<script setup lang="ts">
import { useAnswerStore } from '~~/store'
import type { EmployeeType } from '~~/types'

interface Props {
  employees: EmployeeType[]
  eventId: number
}

const props = withDefaults(defineProps<Props>(), {
  employees: () => [],
})

const answerStore = useAnswerStore()

const answers = computed(() => answerStore.getManyByEventId(props.eventId))

const getAnswerForEmployee = (employeeId: number) => computed(() => {
  return answers.value.find(answer => answer.employeeId === employeeId)
})
</script>
