<!-- eslint-disable vue/prefer-separate-static-class -->
<template>
<Combobox
  v-slot="{ open }"
  v-model="inputValue"
  :name="name"
  :multiple="true"
  @update:model-value="handleChange"
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
        :display-value="(emp) => getEmployeeFullname(emp)"
        @change="query = $event.target.value"
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
      @after-leave="query = ''"
    >
      <ComboboxOptions class="absolute z-20 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
        <div
          v-if="filteredEmployee.length === 0 && query !== ''"
          class="relative px-4 py-2 text-gray-700 cursor-default select-none"
        >
          Aucun trouvé
        </div>
        <li
          class="relative py-2 pl-10 pr-4 cursor-pointer select-none hover:bg-teal-600 hover:text-white"
          :class="{ 'text-gray-900': !areAllSelected }"
          @click="toggleSelectAll"
        >
          <span
            class="block truncate"
            :class="{ 'font-medium': areAllSelected, 'font-normal': !areAllSelected }"
          >
            Tout {{ areAllSelected ? 'désélectionner' : 'sélectionner' }}
          </span>
          <span
            v-if="areAllSelected"
            class="absolute inset-y-0 left-0 flex items-center pl-3 text-teal-600 hover:text-white"
          >
            <CheckIconOutline
              class="w-5 h-5"
              aria-hidden="true"
            />
          </span>
        </li>

        <ComboboxOption
          v-for="employee in filterAlReadyInGroup(filteredEmployee)"
          :key="employee.id"
          v-slot="{ selected, active }"
          as="template"
          :value="employee[valueKey]"
        >
          <li
            class="relative py-2 pl-10 pr-4 cursor-default select-none"
            :class="[isSelected(active, selected, employee.id).value ? 'bg-teal-600 text-white' : 'text-gray-900']"
          >
            <span
              class="block truncate"
              :class="[isSelected(active, selected, employee.id).value ? 'font-medium' : 'font-normal']"
            >
              {{ getEmployeeFullname(employee) }}
            </span>
            <span
              v-if="isSelected(isSelected(active, selected, employee.id).value, selected, employee.id).value"
              class="absolute inset-y-0 left-0 flex items-center pl-3"
              :class="[isSelected(active, selected, employee.id).value ? 'text-white' : 'text-teal-600']"
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

    <div
      v-if="open"
      class="h-56"
    />

    <div class="mt-4">
      <p
        v-for="(value, index) in Object.values(inputValue)"
        :key="index"
        class="flex items-center h-8 px-2 py-2 mt-2 mr-2 space-x-2 bg-blue-200 rounded-md text-blue-dark"
      >
        <span>{{ getEmployeeFullname(defaultValues.find(emp => emp.id === value)) }}</span>
        <button
          type="button"
          @click.prevent="onRemoveValue(index)"
        >
          <XCircleIconSolid class="w-4 h-4 hover:text-red-800" />
        </button>
      </p>
    </div>

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

import type { EmployeeType } from '~~/types'

interface Props {
  defaultValues: EmployeeType[]
  isRequired?: boolean
  helpMessage?: string
  name: string
  valueKey: keyof EmployeeType
  disabled?: boolean
  label?: string
  wrapperClasses?: string
}

const props = withDefaults(defineProps<Props>(), {
  defaultValues: () => [],
  isRequired: false,
  disabled: false,
  label: 'Sélectionner des destinataires',
  wrapperClasses: '',
})

const name = toRef(props, 'name')

const {
  value: inputValue,
  setValue,
  errors,
  handleBlur,
  handleChange,
  meta,
} = useField<Record<string, any>[]>(name, undefined, { })

const { getEmployeeFullname } = employeeHook()
const selected = ref<EmployeeType[]>([])
const query = ref('')

const filteredEmployee = computed(() =>
  query.value === ''
    ? props.defaultValues
    : props.defaultValues.filter(person =>
      person.lastName
        .toLowerCase()
        .replace(/\s+/g, '')
        .includes(query.value.toLowerCase().replace(/\s+/g, '')),
    ),
)

const areAllSelected = computed(() => filteredEmployee.value.length === Object.values(inputValue.value).length)
const isSelected = (active: boolean, selected: boolean, id: number) => computed(() =>
  active || selected || Object.values(inputValue).includes(id),
)

function onRemoveValue(index: number) {
  selected.value.splice(index, 1)
}

function filterAlReadyInGroup(employees: EmployeeType[]) {
  const employeesAlReadyInGroup = inputValue.value.map(emp => emp.id)
  return employees.filter(emp => !employeesAlReadyInGroup.includes(emp.id))
}

function toggleSelectAll() {
  if (filteredEmployee.value.length === Object.values(inputValue.value).length) {
    setValue([])
  } else {
    setValue(filteredEmployee.value.map(emp => emp.id))
  }
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
