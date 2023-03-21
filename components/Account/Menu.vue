<template>
<aside class="px-2 py-6 sm:px-6 lg:col-span-3 lg:py-0 lg:px-0">
  <nav class="sticky space-y-1 top-20">
    <NuxtLink
      v-for="item in subNavigation"
      :key="item.name"
      :to="{ name: item.name }"
      class="flex items-center px-3 py-2 text-sm font-medium rounded-md group"
      :class="[$route.name === item.name ? 'bg-gray-50 text-orange-600 hover:bg-white' : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900']"
      :aria-current="$route.name === item.name ? 'page' : undefined"
    >
      <component
        :is="item.icon"
        class="flex-shrink-0 w-6 h-6 mr-3 -ml-1"
        :class="[$route.name === item.name ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500']"
        aria-hidden="true"
      />
      <span class="truncate">{{ item.label }}</span>
    </NuxtLink>
  </nav>
</aside>
</template>

<script setup lang="ts">
import {
  BellIcon,
  CogIcon,
  CreditCardIcon,
  UserCircleIcon,
  UserGroupIcon,
} from '@heroicons/vue/24/outline'

const subNavigation = [

  { label: 'Profile', name: 'mon-compte', icon: UserCircleIcon },
  { label: 'Paramètres', name: 'mon-compte-parametre', icon: CogIcon },
  { label: 'Utilisateurs', name: 'mon-compte-utilisateurs', icon: UserGroupIcon },
  { label: 'Notifications', name: 'mon-compte-notifications', icon: BellIcon },
  { label: 'Plan & Billing', name: 'mon-compte-plan-billing', icon: CreditCardIcon },
]
</script>
