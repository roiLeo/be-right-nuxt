<template>
<Field
  v-slot="{ field, meta, errors, handleChange, handleBlur }"
  type="text"
  as="div"
  :name="name"
  :class="`flex flex-col text-sm w-full space-y-4 ${wrapperClasses}`"
>
  <label
    v-if="label"
    class="block font-bold text-blue dark:text-gray-100"
    :for="name"
  >
    <!-- Don't insert a line break here, would add a space between the label and the * that we don't want -->
    {{ label }}<span v-if="isRequired">*</span>
  </label>
  <textarea
    v-bind="{ ...(field as object), ...$attrs }"
    :id="name"
    :disabled="disabled"
    :aria-disabled="disabled"
    :placeholder="placeholder"
    :aria-placeholder="placeholder"
    :name="name"
    class="w-full h-[250px] px-3 py-2 placeholder-gray-400 border shadow rounded-md focus:ring-pink-400 focus:border-pink-400 focus:outline-none disabled:bg-gray-100 disabled:border-gray-400"
    :class="[
      getBorderClasses(errors, meta),
    ]"
    @input="handleChange"
    @blur="handleBlur"
  />
  <ErrorMessage
    :name="name"
    class="text-red"
  />
</Field>
</template>

<script setup lang="ts">
import { ErrorMessage, Field } from 'vee-validate'
import type { FieldMeta } from 'vee-validate'

interface Props {
  disabled?: boolean
  isRequired?: boolean
  label?: string
  name: string
  wrapperClasses?: string
  placeholder?: string
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  isRequired: false,
  label: '',
  name: '',
  wrapperClasses: '',
  placeholder: '',
})

function getBorderClasses(errors: string[], meta: FieldMeta<unknown>) {
  if (errors.length > 0) {
    return 'border-red'
  }

  // Only set success if the field has been blured
  if (meta.dirty && meta.valid) {
    return 'border-green'
  }

  return 'border-gray-400'
}
</script>
