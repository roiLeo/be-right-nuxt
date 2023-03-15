<!-- eslint-disable vue/prefer-separate-static-class -->
<template>
<Combobox v-model="inputValue">
  <div class="relative w-full">
    <ComboboxLabel
      v-if="label"
      class="block mb-2 text-sm font-bold text-blue dark:text-gray-100"
    >
      {{ label }}<span v-if="isRequired">*</span>
    </ComboboxLabel>

    <div
      :class="[
        'relative w-full overflow-hidden text-left bg-white rounded-lg shadow-md cursor-default border',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm',
        getBorderClasses(),
      ]"
    >
      <ComboboxInput
        class="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 border-none focus:ring-0"
        :display-value="(person) => getUserfullName(userStore.getOne(person))"
        @change="query = $event.target.value"
      />
      <ComboboxButton
        class="absolute inset-y-0 right-0 flex items-center pr-2"
      >
        <ChevronUpDownIconOutline
          class="w-5 h-5 text-gray-400"
          aria-hidden="true"
        />
      </ComboboxButton>
    </div>
    <TransitionRoot
      leave="transition ease-in duration-100"
      leave-from="opacity-100"
      leave-to="opacity-0"
      @after-leave="query = ''"
    >
      <ComboboxOptions
        :class="[
          'absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5',
          'focus:outline-none sm:text-sm',
        ]"
      >
        <div
          v-if="filteredPhotographer.length === 0 && query !== ''"
          class="relative px-4 py-2 text-gray-700 cursor-default select-none"
        >
          Aucun trouvé {{ filteredPhotographer }}
        </div>

        <ComboboxOption
          v-slot="{ selected, active }"
          as="template"
          :value="null"
        >
          <li
            class="relative py-2 pl-10 pr-4 cursor-default select-none"
            :class="[active || selected ? 'bg-teal-600 text-white' : 'text-gray-900']"
          >
            <span
              class="block truncate"
              :class="[active || selected ? 'font-medium' : 'font-normal']"
            >
              Aucun
            </span>
            <span
              v-if="active || selected"
              class="absolute inset-y-0 left-0 z-20 flex items-center pl-3"
              :class="[active || selected ? 'text-white' : 'text-teal-600']"
            >
              <CheckIconOutline
                class="w-5 h-5"
                aria-hidden="true"
              />
            </span>
          </li>
        </ComboboxOption>

        <ComboboxOption
          v-for="person in filteredPhotographer"
          :key="person.id"
          v-slot="{ selected, active }"
          as="template"
          :value="person[valueKey]"
        >
          <li
            class="relative py-2 pl-10 pr-4 cursor-default select-none"
            :class="{
              'bg-teal-600 text-white': active,
              'text-gray-900': !active,
            }"
          >
            <span
              class="block truncate"
              :class="{ 'font-medium': selected, 'font-normal': !selected }"
            >
              {{ getUserfullName(person) }} {{ person[valueKey] === currentUser?.id ? '(Moi même)' : '' }}
            </span>
            <span
              v-if="selected"
              class="absolute inset-y-0 left-0 flex items-center pl-3"
              :class="{ 'text-white': active, 'text-teal-600': !active }"
            >
              <CheckIconOutline
                class="w-5 h-5"
                aria-hidden="true"
              />
            </span>
          </li>
        </ComboboxOption>
      </ComboboxOptions>
    </TransitionRoot>
    <p
      v-if="helpMessage && errors.length === 0"
      class="text-sm text-gray-700"
    >
      {{ helpMessage }}
    </p>
    <ErrorMessage
      :name="name"
      class="text-red-500"
    />
  </div>
</Combobox>
</template>

<script setup lang="ts">
import { ErrorMessage, useField } from 'vee-validate'
import { useUserStore } from '~~/store'

import type { UserType } from '~~/types'

interface Props {
  defaultValues: UserType[]
  isRequired?: boolean
  helpMessage?: string
  name: string
  valueKey: keyof UserType
  disabled?: boolean
  label?: string
  wrapperClasses?: string
}

const props = withDefaults(defineProps<Props>(), {
  defaultValues: () => [],
  isRequired: false,
  disabled: false,
  label: 'Sélectionner un photographe',
  wrapperClasses: '',
})

const name = toRef(props, 'name')
const userStore = useUserStore()
const currentUser = computed(() => userStore.getAuthUser)

const {
  value: inputValue,
  errors,
  meta,
} = useField<UserType>(name, undefined, { })

const { getUserfullName } = userHook()
const query = ref('')

const filteredPhotographer = computed(() => {
  const peopleArray = [...props.defaultValues]

  if (currentUser.value) {
    peopleArray.push(currentUser.value)
  }

  if (query.value === '') {
    return peopleArray
  }
  return peopleArray.filter(person =>
    person.lastName
      .toLowerCase()
      .replace(/\s+/g, '')
      .includes(query.value.toLowerCase().replace(/\s+/g, ''))
    || person.firstName
      .toLowerCase()
      .replace(/\s+/g, '')
      .includes(query.value.toLowerCase().replace(/\s+/g, '')))
})

function getBorderClasses() {
  if (errors.value.length > 0) {
    return 'border-red'
  }

  // Only set success if the field has been blured
  if (meta.dirty && meta.valid) {
    return 'border-green'
  }

  return 'border-gray-400'
}
</script>
