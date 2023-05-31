<template>
<div :class="`flex flex-col space-y-8 ${wrapperClasses}`">
  <label
    :for="name"
    class="flex items-start justify-start space-x-2 text-gray-900"
  >
    <input
      :id="name"
      class="w-6 h-6 rounded mt-[2px] hover:border-blue-700 checked:text-blue-600 focus:ring-blue-600 focus:border-blue-600 focus:outline-none disabled:border-gray-600 disabled:text-gray-600"
      v-bind="$attrs"
      type="checkbox"
      :checked="checked"
      :disabled="disabled"
      :value="value"
      @change="handleChange"
    >
    <p>
      <!-- Don't insert a line break here, would add a space between the label and the * that we don't want -->
      {{ label }}<span v-if="isRequired">*</span>
    </p>
  </label>
  <ErrorMessage
    :name="name"
    class="text-red"
  />
</div>
</template>

<script lang="ts" setup>
import { useField } from 'vee-validate'

type PossibleValues = boolean | string | number | null

interface Props {
  disabled?: boolean
  error?: string | null
  isRequired?: boolean
  label: string
  name: string
  value: PossibleValues
  wrapperClasses?: string
  uncheckedValue?: PossibleValues
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  isRequired: false,
  error: null,
  label: '',
  name: '',
  wrapperClasses: '',
  uncheckedValue: false,
})

const { name, value, uncheckedValue } = toRefs(props)

const { checked, handleChange } = useField(name, undefined, {
  type: 'checkbox',
  checkedValue: value,
  uncheckedValue,
})
</script>
