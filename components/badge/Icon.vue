<template>
<div
  class="flex items-center w-12 h-12 p-2 mr-3 -ml-1 border rounded-full"
  :class="[userStore.getAuthUserId && badge.userIds.includes(userStore.getAuthUserId) ? 'border-orange-500 ' : 'border-gray-400 group-hover:border-gray-500']"
>
  <component
    :is="Icon()"
    class="w-8 h-8"
    :class="[userStore.getAuthUserId && badge.userIds.includes(userStore.getAuthUserId) ? 'text-orange-500 ' : 'text-gray-400 group-hover:text-gray-500']"
    aria-hidden="true"
  />
</div>
</template>

<script setup lang="ts">
import {
  CalendarDaysIcon,
  CalendarIcon,
  CheckBadgeIcon,
  ShoppingCartIcon,
  UserMinusIcon,
  UserPlusIcon,
} from '@heroicons/vue/24/outline'
import type { Badge } from '~~/store'
import { useUserStore } from '~~/store'

const props = defineProps<Props>()

const userStore = useUserStore()

interface Props {
  badge: Badge
}

function Icon() {
  switch (props.badge.icon) {
    case 'UserMinusIcon':
      return UserMinusIcon
    case 'UserPlusIcon':
      return UserPlusIcon
    case 'CalendarIcon':
      return CalendarIcon
    case 'CalendarDaysIcon':
      return CalendarDaysIcon
    case 'CheckBadgeIcon':
      return CheckBadgeIcon
    case 'ShoppingCartIcon':
      return ShoppingCartIcon
  }
}
</script>
