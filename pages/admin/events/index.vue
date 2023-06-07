<template>
<PageAuthWrapper>
  <div>
    test
  </div>
</PageAuthWrapper>
</template>

<script setup lang="ts">
import PageAuthWrapper from '~/components/Page/PageAuthWrapper.vue'

definePageMeta({
  layout: 'auth',
  isAuth: true,
  isAdmin: true,
  middleware: ['guards-middleware'],
})
</script>
