<template>
<section :aria-labelledby="title">
  <div class="shadow sm:overflow-hidden sm:rounded-md">
    <div class="py-6 bg-white">
      <div class="px-4 pb-6">
        <h2
          :id="title"
          class="text-lg font-medium leading-6 text-gray-900"
        >
          {{ title }}
        </h2>
        <p
          v-if="description"
          class="mt-1 text-sm text-gray-500"
        >
          {{ description }}
        </p>
      </div>

      <slot />
    </div>
    <div
      v-if="$slots.extraButtons"
      class="px-4 py-3 text-right bg-gray-50 sm:px-6"
    >
      <slot name="extraButtons" />
    </div>
  </div>
</section>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description?: string
}

defineProps<Props>()
</script>
