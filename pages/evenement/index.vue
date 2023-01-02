<template>
<div>
  Events
</div>
</template>

<script setup lang="ts">
// const nuxtApp = useNuxtApp()
// console.log(nuxtApp, '<==== nuxtApp')
definePageMeta({
  layout: 'auth',
  isAuth: true,
  middleware: 'guards-middleware',
})
</script>
