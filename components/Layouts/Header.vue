<template>
<header
  class="flex items-center w-full mx-auto shadow-xl md:px-4 md:py-2 max-h-36 dark:bg-blue-dark"
>
  <nav class="w-full">
    <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="relative items-center hidden m-8 md:flex md:h-16 md:m-0 justify-e">
        <div class="items-center justify-between flex-1 hidden md:flex sm:justify-start">
          <div class="items-center flex-shrink-0 md:flex">
            <NuxtLink to="/">
              <LogoSimpleLogo />
            </NuxtLink>
          </div>
          <div class="ml-auto lg:flex lg:items-stretch lg:justify-end">
            <div class="flex space-x-4">
              <a
                href="#Solution"
                class="px-3 py-2 text-sm font-medium rounded-md text-blue dark:text-white dark:hover:text-red-light hover:text-red-light"
              >
                Solutions
              </a>

              <a
                href="#Pricings"
                class="px-3 py-2 text-sm font-medium rounded-md text-blue dark:text-white dark:hover:text-red-light hover:text-red-light"
              >
                Tarifs
              </a>

              <BaseButton
                :href="getButtonPath"
              >
                {{ authStore.getIsLoggedIn ? 'Mon compte' : 'Commencer' }}
              </BaseButton>

              <NuxtLink
                v-if="!authStore.getIsLoggedIn"
                id="login-link"
                :to="{ name: 'login' }"
                class="px-3 py-2 text-sm font-medium rounded-md text-blue dark:text-white dark:hover:text-red-light hover:text-red-light"
              >
                Se connecter
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <div class="grid w-full h-full grid-cols-2 gap-4 md:hidden">
      <NuxtLink
        class="flex items-center justify-center flex-shrink-0 space-x-2"
        to="/"
      >
        <div class="w-10 h-10 border-4 rounded-full border-red">
          <div class="w-4 h-4 m-2 rounded-full bg-red-light" />
        </div>
        <p class="text-xl font-bold">
          Be Right
        </p>
      </NuxtLink>

      <Menu
        as="div"
        class="relative inline-block text-left md:hidden"
      >
        <div>
          <MenuButton
            as="button"
            aria-label="Menu"
            class="inline-flex justify-center w-full"
          >
            <Bars3IconOutline class="h-16 text-gray-800 dark:text-gray-100" />
          </MenuButton>
        </div>

        <MenuItems
          class="absolute right-0 w-56 mt-2 bg-white divide-y divide-gray-100 rounded-md shadow-lg dark:bg-blue-dark_bold ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div class="px-1 py-1">
            <MenuItem
              as="li"
              class="flex items-center w-full px-2 py-2 text-sm rounded-md group"
            >
              <a
                href="#Solution"
                class="px-3 py-2 text-sm font-medium text-black rounded-md hover:text-white dark:text-white"
              >
                Solutions
              </a>
            </MenuItem>
            <MenuItem
              as="li"
              class="flex items-center w-full px-2 py-2 text-sm rounded-md group"
            >
              <a
                href="#Pricings"
                class="px-3 py-2 text-sm font-medium text-black rounded-md hover:text-white dark:text-white"
              >
                Tarifs
              </a>
            </MenuItem>
            <MenuItem
              as="li"
              class="flex items-center w-full px-2 py-2 text-sm rounded-md group"
            >
              <BaseButton
                :href="getButtonPath"
                :title="authStore.getIsLoggedIn ? 'Mon compte' : 'Commencer'"
              >
                {{ authStore.getIsLoggedIn ? 'Mon compte' : 'Commencer' }}
              </BaseButton>
            </MenuItem>
            <MenuItem
              v-if="!authStore.getIsLoggedIn"
              as="li"
              class="flex items-center w-full px-2 py-2 text-sm rounded-md group"
            >
              <NuxtLink
                :to="{ name: 'login' }"
                class="px-3 py-2 text-sm font-medium text-black rounded-md hover:text-white dark:text-white"
              >
                Se connecter
              </NuxtLink>
            </MenuItem>
          </div>
        </MenuItems>
      </Menu>
    </div>
  </nav>
</header>
</template>

<script setup lang="ts">
import { useAuthStore } from '~~/store'

const authStore = useAuthStore()

const getButtonPath = computed(() => {
  if (!authStore.getIsLoggedIn) {
    return { name: 'login' }
  }
  return { name: 'evenement' }
})
</script>
