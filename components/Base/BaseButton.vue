<template>
<NuxtLink
  v-if="href"
  v-bind="$attrs"
  :disabled="disabled"
  :aria-disabled="disabled"
  :aria-label="title"
  role="link"
  :title="title"
  :to="href"
  class="flex justify-center px-4 py-2 text-sm font-medium transition duration-300 ease-in-out transform border border-transparent rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 hover:-translate-y-1 hover:scale-105 font-link"
  :class="[
    colorClasses,
    { 'inline-flex flex-row items-center': $slots.icon },
    { 'justify-start': $slots.icon && $slots.default },
    { 'justify-center': $slots.icon && !$slots.default },
    { 'cursor-not-allowed opacity-70': disabled },
    $attrs.class || '',
  ]"
  @click="onClick($event)"
>
  <span
    v-if="$slots.icon"
    class="w-6 h-6"
    :class="[!$slots.default ? '-mr-2' : 'mr-2']"
  >
    <slot name="icon" />
  </span>
  <span
    v-if="isLoading"
    class="flex items-center justify-center w-full h-full"
  >
    <svg
      class="w-6 h-6 text-white-400 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  </span>
  <template v-else>
    <slot />
  </template>
</NuxtLink>
<component
  :is="tag"
  v-else
  v-bind="$attrs"
  :type="type"
  role="button"
  :disabled="disabled"
  :aria-disabled="disabled"
  :aria-label="title"
  :title="title"
  class="flex items-center justify-center px-4 py-2 text-sm font-medium transition duration-300 ease-in-out transform border border-transparent rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 hover:-translate-y-1 hover:scale-105"
  :class="[
    colorClasses,
    { 'inline-flex flex-row items-center space-x-2': $slots.icon },
    { 'justify-start': $slots.icon && $slots.default },
    { 'justify-center': $slots.icon && !$slots.default },
    { 'cursor-not-allowed opacity-70': disabled },
    $attrs.class || '',
  ]"
  @click="onClick($event)"
>
  <span
    v-if="$slots.icon"
    class="w-6 h-6"
    :class="[!$slots.default ? '-mr-2' : 'mr-2']"
  >
    <slot name="icon" />
  </span>
  <span class="flex items-center justify-center">
    <span
      v-if="isLoading"
      class="flex items-center justify-center w-full h-full"
    >
      <svg
        class="w-6 h-6 text-white-600 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </span>
    <template v-else>
      <slot />
    </template>
  </span>
</component>
</template>

<script
  setup
  lang="ts"
>
import type { RouteLocation } from 'vue-router'

const props = withDefaults(defineProps<Props>(), {
  tag: 'button',
  type: 'button',
  disabled: false,
  color: 'purple',
  variant: 'default',
  href: null,
  isLoading: false,
  title: 'Cliquez',
})

const emit = defineEmits<{
  (e: 'onClick', event: Event): void
}>()

interface Props {
  tag?: string
  href?: string | Record< string, string | Record<string, string | number>> | null | RouteLocation
  type?: 'button' | 'submit'
  disabled?: boolean
  variant?: 'default' | 'social'
  color?: 'purple' | 'white' | 'red' | 'green' | 'blue'
  isLoading?: boolean
  title?: string
}

const colorClasses = computed(() => {
  let textColorClass = 'text-white'
  let backgroundClass = `bg-${props.color}-500`
  if (props.color === 'purple') {
    backgroundClass = 'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600'
  }

  if (props.color === 'white' || !['red', 'green', 'purple'].includes(props.color)) {
    textColorClass = 'text-blue'
    backgroundClass = 'bg-white'
  }
  return `${backgroundClass} ${textColorClass} focus:ring-${props.color}-500`
})

function onClick(event: Event) {
  emit('onClick', event)
}
</script>
