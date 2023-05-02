<template>
<main class="relative min-h-screen">
  <LayoutsHeader />
  <div class="h-full min-h-96">
    <slot />
  </div>
  <LayoutsFooter />
</main>
</template>

<script setup lang="ts">
const router = useRouter()

const { query: { email, token } } = router.currentRoute.value
if (!email || !token) {
  router.replace({
    name: 'answer-error',
  })
}
</script>
