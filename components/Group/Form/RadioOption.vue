<template>
<RadioGroupOption
  v-slot="{ active, checked }"
  as="template"
  :value="value"
>
  <div
    :class="[
      active
        ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300'
        : '',
      checked ? 'bg-sky-900 bg-opacity-75 text-white ' : 'bg-white ',
    ]"
    class="relative flex px-5 py-4 rounded-lg shadow-md cursor-pointer focus:outline-none"
  >
    <div class="flex items-center justify-between w-full">
      <div class="flex items-center">
        <div class="text-sm">
          <RadioGroupLabel
            as="p"
            :class="checked ? 'text-white' : 'text-gray-900'"
            class="font-medium"
          >
            {{ title }}
          </RadioGroupLabel>
          <RadioGroupDescription
            v-if="description"
            as="span"
            :class="checked ? 'text-sky-100' : 'text-gray-500'"
            class="inline"
          >
            {{ description }}
          </RadioGroupDescription>
        </div>
      </div>
      <div
        v-show="checked"
        class="text-white shrink-0"
      >
        <svg
          class="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="12"
            fill="#fff"
            fill-opacity="0.2"
          />
          <path
            d="M7 13l3 3 7-7"
            stroke="#fff"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
  </div>
</RadioGroupOption>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description?: string
  value: string
}

defineProps<Props>()
</script>
