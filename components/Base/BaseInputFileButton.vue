<template>
<Field
  v-slot="{ handleChange, handleBlur, errors, meta }"
  as="div"
  :name="name"
  class="flex flex-col items-center justify-center w-full"
  :class="`${wrapperClasses}`"
>
  <!-- Button with event listener to trigger file upload window when clicking the wrapper -->
  <BaseButton
    :color="meta.valid ? 'green' : meta.dirty ? 'red' : 'blue'"
    class="cursor-pointer"
    :class="[getBorderClasses(errors, meta),
             { disabled: 'cursor-not-allowed' },
    ]"
    :title="label || placeholder"
    @click.stop="onWrapperClick"
  >
    <input
      :id="name"
      ref="fileInput"
      :name="name"
      :disabled="disabled"
      :aria-disabled="disabled"
      type="file"
      class="sr-only"
      accept="application/csv"
      @change="onChange(handleChange)"
      @blur="handleBlur"
    >
    <template #icon>
      <ArrowUpTrayIconOutline />
    </template>
    <label
      class="font-semibold cursor-pointer font-heading"
      :class=" { disabled: 'cursor-not-allowed' }"
      :for="name"
    >
      {{ fileName ? 'Modifier' : label }}<span v-if="isRequired">*</span>
    </label>
  </BaseButton>

  <p class="p-0 ml-1 text-center">
    {{ fileName }}
  </p>
  <ErrorMessage
    :name="name"
    class="text-red"
  />
  <div v-if="debug">
    <p
      v-for="(value, name) in meta"
      :key="name"
      class="p-0 ml-1 text-center"
    >
      {{ name }}: {{ value }}
    </p>
  </div>
</Field>
</template>

<script lang="ts" setup>
import { ErrorMessage, Field } from 'vee-validate'
import type { FieldMeta } from 'vee-validate'

interface Props {
  debug?: boolean
  disabled?: boolean
  fileName?: string
  isRequired?: boolean
  label?: string
  name: string
  placeholder?: string
  wrapperClasses?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Importer une liste de destinataire',
  placeholder: 'Importer une liste de destinataire',
})

const fileInput = ref<HTMLInputElement | null>(null)
const fileName = ref<null | string>(props.fileName || null)

function onChange(handleChange: any) {
  if (fileInput.value?.files) {
    const url = fileInput.value.files[0].name
    fileName.value = url
  }
  handleChange()
}

function getBorderClasses(errors: string[], meta: FieldMeta<any>) {
  if (errors.length > 0) {
    return 'border-red'
  }

  if (meta.dirty && meta.valid) {
    return 'border-green'
  }

  return 'border-gray-400'
}

function onWrapperClick() {
  if (fileInput.value) {
    fileInput.value.click()
  }
}
</script>
