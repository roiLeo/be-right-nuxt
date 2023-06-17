<template>
<div class="w-full mb-4 sm:flex-auto">
  <label
    v-if="label"
    :for="id"
    class="block font-bold"
    :class="{ 'sr-only': label }"
  >
    {{ label }}
  </label>
  <input
    :id="id"
    :value="modelValue"
    class="block w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-md shadow-md appearance-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
    :class="[{ 'cursor-not-allowed border-gray-500 bg-gray-200 opacity-40': uiStore.getUIIsLoading }]"
    type="text"
    placeholder="Recherchez"
    @input="updateInput"
    @keyup="updateSearchQuery"
  >
</div>
</template>

<script setup lang="ts">
import { useUiStore } from '~/store'

interface Props {
  label?: string
  id: string
  modelValue: string
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', str: string): void
  (e: 'update:searchQuery', str: string): void
}>()

const uiStore = useUiStore()

function updateInput(event: any) {
  emit('update:modelValue', event?.target?.value)
}

function updateSearchQuery(payload: any) {
  emit('update:searchQuery', payload?.target?.value)
}
</script>
