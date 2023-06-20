<template>
<main class="flex min-h-screen bg-white dark:bg-blue-dark">
  <MenuDrawer />
  <div class="w-full px-4 py-10 sm:px-6 lg:px-8 lg:ml-64">
    <HeaderDashboard />
    <slot />
  </div>
</main>
</template>

<script setup lang="ts">
import MenuDrawer from '~/components/Menu/MenuDrawer.vue'
import HeaderDashboard from '~/components/Header/HeaderDashboard.vue'
</script>
