<template>
<Menu
  as="div"
  class="relative inline-block text-left"
>
  <div>
    <MenuButton
      :data-cy="`event-${props.event.id}-options-links`"
      class="inline-flex justify-center w-full px-2 py-1 text-sm font-medium text-purple-500 bg-purple-300 border border-purple-500 rounded-md bg-opacity-20 hover:bg-opacity-40 hover:text-purple-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
    >
      Options
      <ChevronDownIconSolid
        class="w-5 h-5 ml-1 -mr-1 text-purple-500 hover:text-purple-800"
        aria-hidden="true"
      />
    </MenuButton>
  </div>

  <transition
    enter-active-class="transition duration-100 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <MenuItems
      class="absolute right-0 z-10 w-56 mt-2 overflow-visible origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
    >
      <div class="px-1 py-1">
        <MenuItem>
          <NuxtLink
            class="flex items-center w-full px-2 py-2 text-sm rounded-md group"
            :to="{ name: 'evenement-show-id', params: { id: event.id } }"
          >
            <PencilSquareIconOutline
              class="w-5 h-5 mr-2 text-gray-800"
              aria-hidden="true"
            />
            Voir
          </NuxtLink>
        </MenuItem>
        <MenuItem v-if="answer">
          <NuxtLink
            class="flex items-center w-full px-2 py-2 text-sm rounded-md group"
            :class="{ isDowloadDisabled: 'cursor-not-allowed opacity-50' }"
            :to="{
              name: 'evenement-answer-download-id',
              params: {
                id: answer.id,
              },
            }"
            :disabled="isDowloadDisabled"
          >
            <ArrowDownTrayIconOutline
              class="w-5 h-5 mr-2 text-gray-800"
              aria-hidden="true"
            />
            Télécharger
          </NuxtLink>
        </MenuItem>
      </div>
    </MenuItems>
  </transition>
</Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import type { EventType } from '@/types'
import { useAnswerStore } from '~~/store'

interface Props {
  event: EventType
  employeeId: number
}

const props = defineProps<Props>()
const answerStore = useAnswerStore()

const answer = computed(() => answerStore.getAllArray.find(answer =>
  answer.eventId === props.event.id && answer.employeeId === props.employeeId),
)

const isDowloadDisabled = computed(() => !answer.value || !answer.value?.signedAt)
</script>
