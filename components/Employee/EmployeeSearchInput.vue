<template>
<Combobox
  :model-value="inputValue"
  :name="name"
  as="div"
  :class="`flex flex-col w-full space-y-4 text-sm ${wrapperClasses}`"
  :multiple="true"
  @update:model-value="handleChange"
  @blur="handleBlur"
>
  <ComboboxLabel
    v-if="label"
    class="block text-sm font-bold text-blue dark:text-gray-100"
  >
    <!-- Don't insert a line break here, would add a space between the label and the * that we don't want -->
    {{ label }}<span v-if="isRequired">*</span>
  </ComboboxLabel>
  <div class="relative mt-1">
    <div
      class="relative w-full overflow-hidden text-left bg-white border rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm disabled:bg-gray-100 disabled:border-gray-400 disabled:opacity-50"
      :class="[
        getBorderClasses(),
      ]"
    >
      <ComboboxInput
        class="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-800 border-none focus:ring-0"
        :display-value="(id) => getDisplayName(id as number)"
        @change="query = $event.target.value"
      />
      <ComboboxButton
        class="absolute inset-y-0 right-0 flex items-center pr-2"
      >
        <ArrowsUpDownIconOutline
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
        class="absolute z-10 w-full mt-2 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
      >
        <div
          v-if="filteredEmployees.length === 0 && query !== ''"
          class="relative px-4 py-2 text-gray-700 cursor-default select-none"
        >
          Aucun trouvé
        </div>

        <ComboboxOption
          v-for="employee in filteredEmployees"
          :key="employee.id"
          v-slot="{ selected, active }"
          as="template"
          :value="employee[valueKey]"
        >
          <li
            class="relative py-2 pl-10 pr-4 cursor-default select-none"
            :class="{
              'bg-teal-600 text-black rounded-md': active,
              'text-gray-900': !active,
            }"
          >
            <span
              class="block truncate"
              :class="{ 'font-medium': selected, 'font-normal': !selected }"
            >
              {{ getEmployeeFullname(employee) }}
            </span>
            <span
              v-if="selected"
              class="absolute inset-y-0 left-0 flex items-center pl-3"
              :class="{ 'text-black': active, 'text-white': !active }"
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
  </div>
</Combobox>
<div class="flex flex-wrap">
  <p
    v-for="(value, index) in inputValue"
    :key="index"
    class="flex items-center h-8 px-2 py-2 mt-2 mr-2 space-x-2 bg-blue-200 rounded-md text-blue-dark"
  >
    <span>{{ getDisplayName(value as unknown as number) }}</span>
    <button
      type="button"
      @click.prevent="onRemoveValue(value)"
    >
      <XCircleIconSolid class="w-4 h-4 hover:text-red-800" />
    </button>
  </p>
</div>
<ErrorMessage
  :name="name"
  class="text-red-500"
/>
</template>

<script setup lang="ts">
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot,
} from '@headlessui/vue'
import { ErrorMessage, useField } from 'vee-validate'
import type { EmployeeTypeOmitRelations } from '@/types'
import { useEmployeeStore, useTableStore, useUiStore } from '~~/store'

interface Props {
  label?: string
  name: string
  placeholder?: string
  isRequired?: boolean
  disabled?: boolean
  wrapperClasses?: string
  valueKey: keyof EmployeeTypeOmitRelations
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  isRequired: false,
  wrapperClasses: '',
  placeholder: 'Choisissez un destinaire',
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

const { IncLoading, DecLoading } = useUiStore()
const employeeStore = useEmployeeStore()
const tableStore = useTableStore()
const { setSearch } = tableStore
const { fetchAll, getEmployeeFullname, filteredEmployees: searchEmployees } = employeeHook()

const query = ref('')

onMounted(async () => {
  IncLoading()
  await fetchAll()
  DecLoading()
})

watch(() => query.value, async newValue => {
  IncLoading()
  setSearch(newValue)
  await fetchAll(tableStore.getFinalUrl)
  DecLoading()
})

function getBorderClasses() {
  if (errors.value.length > 0) {
    return 'border-red-500'
  }

  // Only set success if the field has been blured
  if (meta.dirty && meta.valid) {
    return 'border-green-500'
  }

  return 'border-gray-400'
}

const filteredEmployees = computed(() => searchEmployees(employeeStore.getAllArray, query))

function getDisplayName(id: number) {
  if (id) {
    if (employeeStore.isAlreadyInStore(id)) {
      return getEmployeeFullname(employeeStore.getOne(id))
    }
  }
  return ''
}

function onRemoveValue(value: any) {
  const newValue = Object.values(inputValue.value).filter(val => val !== value)
  setValue(newValue)
}
</script>
