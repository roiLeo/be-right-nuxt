<template>
<ListboxOption
  v-slot="{ active, selected }"
  :value="value"
  as="template"
>
  <li
    class="relative cursor-pointer select-none py-2 px-4 text-gray-700"
    :class="[
      active ? 'bg-gray-200' : '',
    ]"
  >
    <span
      class="block truncate text-sm font-bold text-blue dark:text-gray-100"
      :class="[
        selected ? 'font-medium' : 'font-normal',
      ]"
    >{{ name }}</span>
    <span
      v-if="selected"
      class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-700"
    >
      <CheckIconOutline
        class="w-6 h-6"
        aria-hidden="true"
      />
    </span>
  </li>
</ListboxOption>
</template>

<script lang="ts" setup>
interface Props {
  value: any
  name: string
}

defineProps<Props>()
</script>
