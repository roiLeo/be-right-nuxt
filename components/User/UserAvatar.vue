<template>
<span
  id="user-avatar"
  class="relative inline-block"
>
  <img
    v-if="user?.profilePicture"
    :class="`${avatarSize} rounded-full border`"
    :src="user?.profilePicture"
    alt="avatar"
  >
  <div
    v-else
    :class="`${avatarSize} rounded-full border border-blue-dark dark:text-white-break dark:border-gray-300 flex items-center justify-center font-bold uppercase`"
  >
    {{ user?.firstName[0] }}
    {{ user?.lastName[0] }}
  </div>
  <span
    :class="`absolute top-0 right-0 block rounded-full ring-2 ring-white ${isConnectedPinVariations.color} ${isConnectedPinVariations.size}`"
  />
</span>
</template>

<script setup lang="ts">
import type { UserType } from '@/types'
import { useUserStore } from '~~/store'

interface Props {
  user: UserType
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'lg',
})

const userStore = useUserStore()

const avatarSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-10 h-10'

    case 'md':
      return 'w-12 h-12'

    case 'lg':
      return 'w-14 h-14'

    case 'xl':
      return 'w-16 h-16'

    default:
      return 'w-14 h-14'
  }
})

function isUserCurrentLoggedColor() {
  if (props.user) {
    if (userStore.getAuthUser?.id === props.user?.id)
      return 'bg-green-500'

    return 'bg-red-500'
  }
  return 'bg-gray-500'
}

const isConnectedPinVariations = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        size: 'w-2.5 h-2.5',
        color: isUserCurrentLoggedColor(),
      }

    case 'md':
      return {
        size: 'w-3 h-3',
        color: isUserCurrentLoggedColor(),
      }

    case 'lg':
      return {
        size: 'w-3.5 h-3.5',
        color: isUserCurrentLoggedColor(),
      }

    case 'xl':
      return {
        size: 'w-4 h-4',
        color: isUserCurrentLoggedColor(),
      }

    default:
      return {
        size: 'w-3 h-3',
        color: isUserCurrentLoggedColor(),
      }
  }
})
</script>
