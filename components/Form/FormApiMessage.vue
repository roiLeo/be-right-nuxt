<template>
<div
  v-if="handleMessage || handleErrors?.length"
  class="w-full px-3 py-2 text-sm border rounded"
  :class="[colors]"
>
  <template v-if="handleErrors?.length">
    <p v-if="handleErrors.length > 1">
      Des erreurs sont survenues:
    </p>
    <p v-else>
      Une erreur est survenue:
    </p>
    <ul class="pl-6 list-disc">
      <li
        v-for="(error, index) in handleErrors"
        :key="index"
      >
        {{ error }}
      </li>
    </ul>
  </template>
  <p v-if="handleMessage && handleMessage?.length">
    {{ handleMessage }}
  </p>
</div>
</template>

<script setup lang="ts">
interface Props {
  errors?: string[]
  message?: string | null
  isSuccess: boolean
}
const props = defineProps<Props>()
const handleErrors = computed(() => props.errors)
const handleMessage = computed(() => props.message)
const colors = computed(() => {
  if (props.isSuccess) {
    return 'bg-green-100 text-green-500 border-green-500'
  }
  return 'bg-red-50 text-red-600 border-red-500'
})
</script>
