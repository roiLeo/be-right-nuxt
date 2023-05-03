<template>
<div class="relative">
  <img
    v-if="!isLoading"
    :src="src"
    :alt="alt || 'illustration'"
    class="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
  >
  <BaseLoader v-else />
  <div class="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-gray-900/10" />
</div>
</template>

<script setup lang="ts">
import { useImage } from '@vueuse/core'
import BaseLoader from '~/components/Base/BaseLoader.vue'

interface Props {
  src: string
  alt?: string
}

const props = defineProps<Props>()

const { isLoading } = useImage({ src: props.src })
</script>
