<template>
<PageAuthWrapper>
  Destinataires
</PageAuthWrapper>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  isAuth: true,
  middleware: 'guards-middleware',
})
</script>
