<template>
<Field
  v-slot="{ handleChange, meta, value, errors }"
  as="div"
  :name="name"
  class="flex flex-col items-center justify-center w-full"
  :class="`${wrapperClasses}`"
>
  <div
    ref="otpCont"
    class="inline-flex w-full"
  >
    <input
      v-for="(_, ind) in digits"
      :key="ind"
      v-model="digits[ind]"
      type="text"
      :name="name[ind]"
      :class="[
        // eslint-disable-next-line vue/prefer-separate-static-class
        'h-16 w-full border-black-2 border inline-block rounded-md m-1 p-3.5 text-2xl bg-white focus:outline focus:outline-indigo-500',
        { 'border-red-300 focus:outline-red-300': errors?.length },
        { 'cursor-not-allowed disabled:border-gray-500 disabled:bg-gray-200': disabled },
        getBorderClasses(errors, meta),
      ]"
      :autofocus="ind === 0"
      :placeholder="(ind).toString()"
      maxlength="1"
      @keydown="$event => handleKeyDown($event, ind, handleChange)"
    >
  </div>

  <ErrorMessage
    :name="name"
    class="text-red-500"
  />

  <div v-if="debug">
    <p
      v-for="(val, name) in { ...meta, value }"
      :key="name"
      class="p-0 ml-1 text-center text-white"
    >
      {{ name }}: {{ val }}
    </p>
  </div>
</Field>
</template>

<script setup lang="ts">
import type { FieldMeta } from 'vee-validate'
import { ErrorMessage, Field } from 'vee-validate'

interface Props {
  default?: string
  digitCount: number
  debug?: boolean
  disabled?: boolean
  wrapperClasses?: string
  name: string
}

const props = defineProps<Props>()

const emit = defineEmits(['update:otp'])

const digits = reactive<string[] | null []>([])

if (props.default && props.default.length === props.digitCount) {
  for (let i = 0; i < props.digitCount; i++) {
    digits[i] = props.default.charAt(i)
  }
} else {
  for (let i = 0; i < props.digitCount; i++) {
    digits[i] = null
  }
}

const otpCont = ref<null | HTMLInputElement>(null)

function isDigitsFull() {
  for (const elem of digits) {
    if (elem === null || elem === undefined) {
      return false
    }
  }
  return true
}

function handleKeyDown(event: KeyboardEvent, index: number, handleChange: any) {
  if (!['Tab', 'ArrowRight', 'ArrowLeft'].includes(event.key)) {
    event.preventDefault()
  }

  if (['Tab', 'ArrowRight', 'ArrowLeft', 'Shift'].includes(event.key) && otpCont.value) {
    digits[index] = null
    if (event.key === 'Shift' || isLastCase(index))
      return
    if (['Tab', 'ArrowRight'].includes(event.key)) {
      if (event.key === 'Tab') {
        const input = (otpCont.value.children)[index] as HTMLInputElement
        input.focus()
        return
      }
      const input = (otpCont.value.children)[index + 1] as HTMLInputElement
      input.focus()
      return
    }
    if (event.key === 'ArrowLeft' && index !== 0) {
      const input = (otpCont.value.children)[index - 1] as HTMLInputElement
      input.focus()
      return
    }
  }

  if (['Backspace', 'Delete', 'ArrowLeft'].includes(event.key)) {
    digits[index] = null

    if (index !== 0 && otpCont.value) {
      const input = (otpCont.value.children)[index - 1] as HTMLInputElement
      input.focus()
    }
    handleChange(digits.join(''))
    return
  }

  const regex = /^[a-zA-Z0-9]+$/

  if (regex.test(event.key)) {
    digits[index] = event.key.toUpperCase()

    if (index !== props.digitCount - 1 && otpCont.value) {
      const input = (otpCont.value.children)[index + 1] as HTMLInputElement
      input.focus()
    }
  }

  if (isDigitsFull()) {
    emit('update:otp', digits.join(''))
  }
  handleChange(digits.join(''))
}

function isLastCase(index: number) {
  return index === (props.digitCount - 1)
}

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
