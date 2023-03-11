<template>
<Listbox
  :model-value="inputValue"
  :name="name"
  :class="`flex flex-col w-full space-y-4 text-sm ${wrapperClasses}`"
  as="div"
  :multiple="true"
  @update:model-value="handleChange"
  @blur="handleBlur"
>
  <ListboxLabel
    v-if="label"
    class="block text-sm font-bold text-blue dark:text-gray-100"
  >
    <!-- Don't insert a line break here, would add a space between the label and the * that we don't want -->
    {{ label }}<span v-if="isRequired">*</span>
  </ListboxLabel>
  <div class="relative">
    <ListboxButton
      class="relative w-full px-4 py-2 text-left placeholder-gray-400 border rounded-md shadow focus:ring-pink-400 focus:border-pink-400 focus:outline-none disabled:bg-gray-100 disabled:border-gray-400"
      :class="[
        getBorderClasses(),
      ]"
    >
      <span class="block truncate">{{ placeholder }}</span>
      <span class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <ArrowsUpDownIconOutline
          class="w-6 h-6 text-gray-800"
          aria-hidden="true"
        />
      </span>
    </ListboxButton>
    <transition
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <ListboxOptions
        :multiple="true"
        class="absolute z-10 w-full mt-2 overflow-auto bg-white border border-gray-500 rounded-md shadow-lg pt max-h-60 focus:outline-none"
      >
        <ListboxOption
          v-slot="{ active, selected, disabled }"
          :value="values"
          as="li"
          @click="toggleSelectAll"
        >
          <label
            for="all"
            class="relative flex items-start justify-start px-4 py-2 space-x-2 text-sm text-gray-900 cursor-pointer select-none"
            :class="[
              active ? 'bg-gray-200' : 'bg-white',
              disabled ? 'opacity-50' : '',
            ]"
          >
            <input
              name="all"
              class="w-4 h-4 rounded border-green-600 mt-[2px] hover:border-green-700 checked:text-green-600 focus:ring-green-600 focus:border-green-600 focus:outline-none disabled:border-gray-600 disabled:text-gray-600"
              type="checkbox"
              :checked="selected"
            >
            <span>Sélectionner tout</span>
          </label>
        </ListboxOption>
        <ListboxOption
          v-for="value in values"
          v-slot="{ active, selected, disabled }"
          :key="value[valueKey]"
          :value="value[valueKey]"
          as="li"
        >
          <!-- :disabled="!inputValue?.includes(value[valueKey]) && inputValue.length >= max" -->
          <label
            :for="getDisplayName(value[valueKey])"
            class="relative flex items-start justify-start px-4 py-2 space-x-2 text-sm text-gray-900 cursor-pointer select-none"
            :class="[
              active ? 'bg-gray-200' : 'bg-white',
              disabled ? 'opacity-50' : '',
            ]"
          >
            <input
              :name="getDisplayName(value[valueKey])"
              class="w-4 h-4 rounded border-green-600 mt-[2px] hover:border-green-700 checked:text-green-600 focus:ring-green-600 focus:border-green-600 focus:outline-none disabled:border-gray-600 disabled:text-gray-600"
              type="checkbox"
              :checked="selected"
            >
            <span>{{ getDisplayName(value[valueKey]) }}</span>
          </label>
        </ListboxOption>
      </ListboxOptions>
    </transition>
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
  <div class="flex flex-wrap">
    <p
      v-for="(value, index) in inputValue"
      :key="index"
      class="flex items-center h-8 px-2 py-2 mt-2 mr-2 space-x-2 bg-blue-200 rounded-md text-blue-dark"
    >
      <span>{{ getDisplayName(value) }}</span>
      <button
        type="button"
        @click.prevent="onRemoveValue(value)"
      >
        <XCircleIconSolid class="w-4 h-4 hover:text-red-800" />
      </button>
    </p>
  </div>
</Listbox>
</template>

<script lang="ts" setup>
import { ErrorMessage, useField } from 'vee-validate'

interface Props {
  disabled?: boolean
  displayKey: string | ((_value: Record<string, any>) => string)
  helpMessage?: string
  isRequired?: boolean
  label: string
  max?: number
  name: string
  placeholder: string
  valueKey: string
  values: Record<string, any>[]
  wrapperClasses?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  helpMessage: '',
  isRequired: false,
  max: Number.MAX_SAFE_INTEGER,
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

function getDisplayName(value: any) {
  const selected = props.values.find(val => val[props.valueKey] === value)
  if (selected) {
    if (typeof props.displayKey === 'string') {
      return selected[props.displayKey]
    }
    return props.displayKey(selected)
  }
}

function toggleSelectAll() {
  if (props.values.length === inputValue.value.length) {
    setValue([])
  } else {
    setValue(props.values)
  }
}

function onRemoveValue(value: any) {
  const newValue = Object.values(inputValue.value).filter(val => val !== value)
  setValue(newValue)
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
