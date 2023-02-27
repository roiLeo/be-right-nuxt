<template>
<div class="relative flex items-center p-3 rounded-full shadow-lg">
  <BellIcon class="w-6 h-6" />
  <span
    v-if="hasRedBubble"
    class="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-sm font-thin text-white bg-red-500 rounded-full ring-2 ring-white"
  >{{ newNotificationNb }}</span>
</div>
</template>

<script setup lang="ts">
import { BellIcon } from '@heroicons/vue/24/outline'

interface Props {
  hasRedBubble?: boolean
  newNotificationNb: number
}
withDefaults(defineProps<Props>(), {
  newNotificationNb: 0,
})
</script>
