<template>
<PageAuthWrapper>
  Bugs
</PageAuthWrapper>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  isAuth: true,
  isAdmin: true,
  middleware: ['guards-middleware'],
})
</script>
