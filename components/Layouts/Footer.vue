<template>
<footer class="z-50 w-full shadow-3xl dark:bg-blue-dark_bold DarkModeAnimation">
  <div class="grid grid-cols-1 md:grid-cols-2">
    <div
      class="flex flex-col items-center justify-between w-full h-full py-6 mx-auto mb-6 text-black bg-white dark:text-white dark:bg-blue-dark_bold"
    >
      <LogoSimpleLogo class="mb-4 md:mb-10" />
      <!-- <DarkModeToggle /> -->
      {{ `© Be Right ${new Date().getFullYear()}` }}
    </div>
    <div class="flex-1 py-6 text-center bg-gray-800 dark:bg-transparent">
      <p class="text-gray-200 uppercase lg:mt-4 md:mb-6">
        Menu
      </p>
      <ul class="mb-6 list-reset">
        <li class="inline-block mt-2 mr-2 md:block md:mr-0">
          <NuxtLink
            :to="getLinkPath"
            class="text-white no-underline hover:underline hover:text-red-light"
          >
            {{ authStore.getIsLoggedIn ? 'Mon compte' : 'Se connecter' }}
          </NuxtLink>
        </li>
        <li class="inline-block mt-2 mr-2 md:block md:mr-0">
          <NuxtLink
            v-if="!authStore.getIsLoggedIn"
            :to="{ name: 'register' }"
            class="text-white no-underline hover:underline hover:text-red-light"
          >
            s'inscrire
          </NuxtLink>
          <p
            v-else
            class="text-white no-underline cursor-pointer hover:underline hover:text-red-light"
            @click="logout"
          >
            Se déconnecter
          </p>
        </li>
        <li class="inline-block mt-2 mr-2 md:block md:mr-0">
          <NuxtLink
            :to="{ name: 'index' }"
            class="text-white no-underline hover:underline hover:text-red-light"
          >
            Accueil
          </NuxtLink>
        </li>
      </ul>
      <p class="text-xs text-gray-500">
        designed by digital campus students
      </p>
    </div>
  </div>
</footer>
</template>

<script setup lang="ts">
import { useAuthStore } from '~~/store'

const authStore = useAuthStore()
const { logout } = authHook()

const getLinkPath = computed(() => {
  if (!authStore.getIsLoggedIn) {
    return { name: 'login' }
  }
  return { name: 'evenement' }
})
</script>
