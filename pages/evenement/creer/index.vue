<template>
<EventFormStep1 class="px-4 lg:px-8" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'create-event-layout',
  isAuth: true,
  middleware: 'guards-middleware',
})
</script>
