<template>
<Listbox
  v-model="getSetLimit"
>
  <div class="relative w-18 md:w-20">
    <ListboxButton
      class="relative w-full py-2 pl-3 pr-10 text-left bg-white border rounded-lg shadow-md cursor-pointer border-amber-500 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
    >
      <span class="block truncate">{{ getSetLimit }}</span>
      <span
        class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
      >
        <ChevronUpDownIcon
          class="w-5 h-5 text-gray-400"
          aria-hidden="true"
        />
      </span>
    </ListboxButton>

    <ListboxOptions
      class="absolute z-50 w-full mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
    >
      <ListboxOption
        v-for="limit in limits"
        v-slot="{ active, selected }"
        :key="limit"
        :value="limit"
        as="ul"
        class="divide-y-2 divide-teal-500"
      >
        <li
          class="relative flex items-center py-2 pl-2 space-x-2 cursor-pointer select-none"
          :class="[
            active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
          ]"
        >
          <span
            class="block truncate"
            :class="[
              selected ? 'font-medium' : 'font-normal',
            ]"
          >{{ limit }}</span>
          <span
            v-if="selected"
            class="flex items-center text-amber-600"
          >
            <CheckIcon
              class="w-5 h-5"
              aria-hidden="true"
            />
          </span>
        </li>
      </ListboxOption>
    </ListboxOptions>
  </div>
</Listbox>
</template>

<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

interface Props {
  defaultLimit: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:limit', nb: number): void
}>()

const limits = [
  10,
  15,
  20,
  50,
  100,
]

const getSetLimit = computed({
  get: () => props.defaultLimit,
  set: val => {
    emit('update:limit', val)
  },
})
</script>
