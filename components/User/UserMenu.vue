<template>
<Menu
  as="div"
  class="relative ml-3"
>
  <div>
    <MenuButton
      v-if="userStore.getAuthUser"
      class="flex items-center flex-shrink-0 p-4"
      data-cy="user-menu-button"
    >
      <UserAvatar :user="userStore.getAuthUser" />
      <div
        v-if="!isInHeader"
        class="ml-3"
      >
        <p class="text-sm font-medium text-gray-600 dark:text-white">
          {{ authStore.getLoggedUserFullName }}
        </p>
      </div>
    </MenuButton>
  </div>
  <transition
    enter-active-class="transition duration-100 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-75 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <MenuItems
      class="absolute w-48 py-1 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      :class="[isInHeader ? 'origin-top-left -left-28' : 'origin-top-right -top-24']"
      as="div"
    >
      <MenuItem
        v-slot="{ active }"
        as="div"
      >
        <NuxtLink
          :to="{ name: 'mon-compte', params: { id: userStore.getAuthUser?.id } }"
          class="flex items-center justify-start px-4 py-2 space-x-2 text-sm text-gray-700"
          :class="[active ? 'bg-gray-100' : '']"
        >
          <UserCircleIconOutline class="h-6 text-gray-500" />
          <span>Voir le profile</span>
        </NuxtLink>
      </MenuItem>

      <MenuItem
        v-if="!authStore.isAuthUserAdmin"
        as="div"
      >
        <div class="flex items-center justify-start w-full space-x-2 text-sm text-gray-700 cursor-pointer">
          <ExclamationCircleIconOutline class="h-6 text-gray-500" />
          <NuxtLink>
            Signaler un problème
          </NuxtLink>
        </div>
      </MenuItem>
      <MenuItem>
        <NuxtLink
          data-cy="user-menu-logout-link"
          class="flex items-center justify-start w-full space-x-2 text-sm text-gray-700 cursor-pointer"
          @click="onToggleLogout"
        >
          <ArrowLeftOnRectangleIconOutline class="h-6 text-gray-500" />
          Se déconnecter
        </NuxtLink>
      </MenuItem>
    </MenuItems>
  </transition>
</Menu>
</template>

<script setup lang="ts">
import { useAuthStore, useUserStore } from '~~/store'

withDefaults(defineProps<Props>(), {
  isInHeader: false,
})
const userStore = useUserStore()
const authStore = useAuthStore()
const { logout } = authHook()
const router = useRouter()

interface Props {
  isInHeader?: boolean
}

function onToggleLogout() {
  logout()
  router.replace('/')
}
</script>
