<template>
<main class="flex min-h-screen bg-white dark:bg-blue-dark">
  <MenuDrawer />

  <div class="w-full lg:ml-64">
    <HeaderDashboard />
    <slot />
  </div>
</main>
</template>

<script setup lang="ts">
const router = useRouter()
console.log(router.getRoutes(), '<==== router.getRoutes()')
</script>
