<template>
<nav class="flex-1 mt-5 space-y-4">
  <MenuDropdown :routes="ADMIN_MENU_ITEMS" />
</nav>
</template>

<script setup lang="ts">
import MenuDropdown from '~~/components/Menu/MenuDropdown.vue'
import { ADMIN_MENU_ITEMS } from '@/helpers/menu'
</script>
