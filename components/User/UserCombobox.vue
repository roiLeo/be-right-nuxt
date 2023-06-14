<!-- eslint-disable vue/prefer-separate-static-class -->
<template>
<Combobox
  v-slot="{ open }"
  :name="name"
  @update:model-value="handle"
  @blur="handleBlur"
>
  <div :class="`relative mt-1 ${wrapperClasses}`">
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
        :display-value="(id: unknown) => id ? getUserfullName(defaultValues.find(user => user.id === id)!) : 'Choisissez un utilisateur'"
        @change="($event) => search($event)"
      />
      <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
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
    >
      <ComboboxOptions class="absolute z-20 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
        <div
          v-if="filteredUser.length === 0 && query !== ''"
          class="relative px-4 py-2 text-gray-700 cursor-default select-none"
        >
          Aucun trouvé
        </div>
        <template v-if="filteredUser.length > 0">
          <ComboboxOption
            v-for="user in filteredUser"
            :key="user.id"
            v-slot="{ selected, active }"
            as="template"
            :value="user[valueKey]"
            :disabled="disabledValues?.includes(user.id)"
          >
            <li
              class="relative py-2 pl-10 pr-4 cursor-default select-none"
              :class="[
                isSelected(active, selected, user.id).value ? 'bg-teal-600 text-white' : 'text-gray-900',
                { 'cursor-not-allowed opacity-50': disabledValues?.includes(user.id) },
              ]"
            >
              <span
                class="block truncate"
                :class="[isSelected(active, selected, user.id).value ? 'font-medium' : 'font-normal']"
              >
                {{ getUserfullName(user) }}
              </span>
              <span
                v-if="isSelected(isSelected(active, selected, user.id).value, selected, user.id).value"
                class="absolute inset-y-0 left-0 flex items-center pl-3"
                :class="[isSelected(active, selected, user.id).value ? 'text-white' : 'text-teal-600']"
              >
                <CheckIconOutline
                  class="w-5 h-5"
                  aria-hidden="true"
                />
              </span>
            </li>
          </ComboboxOption>
        </template>
        <BaseLoader v-else />
      </ComboboxOptions>
    </TransitionRoot>

    <div
      v-if="open"
      class="h-56"
    />

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

import BaseLoader from '../Base/BaseLoader.vue'
import type { InputEventTarget, UserType } from '~~/types'

interface Props {
  defaultValues: UserType[]
  isRequired?: boolean
  helpMessage?: string
  name: string
  valueKey: keyof UserType
  disabled?: boolean
  label?: string
  wrapperClasses?: string
  disabledValues?: number[]
}

const props = withDefaults(defineProps<Props>(), {
  defaultValues: () => [],
  disabledValues: () => [],
  isRequired: false,
  disabled: false,
  label: 'Sélectionner des destinataires',
  wrapperClasses: '',
})

const emit = defineEmits<{
  (e: 'change', ids: number[]): void
  (e: 'search', query: string): void
}>()

const name = toRef(props, 'name')

const {
  value: inputValue,
  errors,
  handleBlur,
  handleChange,
  meta,
} = useField<Field>(name, undefined, { initialValue: [] })

function handle(e: unknown) {
  handleChange(e)
  emit('change', inputValue.value as number[])
}

type Field = UserType[] | number[]

const { getUserfullName, filteredUsers } = userHook()

const query = ref('')

const filteredUser = computed(() => filteredUsers(props.defaultValues, query))

const isSelected = (active: boolean, selected: boolean, id: number) => computed(() =>
  active || selected || Object.values(inputValue.value).includes(id),
)

function search(event: InputEventTarget) {
  query.value = event?.target?.value
  emit('search', query.value)
}

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
