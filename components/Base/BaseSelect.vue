<template>
<Listbox
  :model-value="inputValue"
  as="div"
  :name="name"
  :class="`flex flex-col w-full space-y-2 ${wrapperClasses}`"
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
    <!-- appearance-none block shadow-md py-2 px-4 border focus:ring-purple-500 focus:border-purple-500 w-full sm:text-sm border-gray-300 rounded-md text-gray-80 -->
    <ListboxButton
      class="relative w-full px-4 py-2 text-left placeholder-gray-400 border rounded-md shadow-md sm:text-sm focus:ring-pink-400 focus:border-pink-400 focus:outline-none disabled:bg-gray-100 disabled:border-gray-400"
      :class="[
        getBorderClasses(),
      ]"
    >
      <span class="block truncate">{{ displayValue || placeholder }}</span>
      <span class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <ArrowsUpDownIconOutline
          class="w-6 h-6 text-gray-900"
          aria-hidden="true"
        />
      </span>
    </ListboxButton>
    <ListboxOptions
      class="absolute z-10 w-full py-2 mt-2 overflow-auto bg-white border border-gray-500 rounded-md shadow-lg max-h-60 focus:outline-none"
    >
      <ListboxOption
        v-if="!isRequired"
        v-slot="{ active, selected }"
        value=""
        as="template"
      >
        <li
          class="relative px-4 py-2 text-gray-900 cursor-default select-none"
          :class="[
            active ? 'bg-gray-200' : '',
          ]"
        >
          <span class="block truncate">{{ placeholder }}</span>
          <span
            v-if="selected"
            class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-900"
          >
            <CheckIconOutline
              class="w-6 h-6"
              aria-hidden="true"
            />
          </span>
        </li>
      </ListboxOption>
      <slot />
    </ListboxOptions>
  </div>
  <ErrorMessage
    :name="name"
    class="text-red"
  />
</Listbox>
</template>

<script lang="ts" setup>
import { ErrorMessage, useField } from 'vee-validate'

interface Props {
  disabled?: boolean
  displayValue: string | null
  isRequired?: boolean
  label: string
  name: string
  placeholder: string
  wrapperClasses?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  isRequired: false,
  wrapperClasses: '',
  displayValue: null,
})

const name = toRef(props, 'name')

const {
  value: inputValue,
  errors,
  handleBlur,
  handleChange,
  meta,
} = useField(name, undefined, {
  initialValue: '',
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
