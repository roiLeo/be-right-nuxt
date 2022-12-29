<template>
<div
  class="flex items-center justify-center w-full cursor-pointer"
  @click="redirectHome"
>
  <div class="w-10 h-10 border-4 rounded-full border-red">
    <div class="w-4 h-4 m-2 rounded-full bg-red-light" />
  </div>
  <h1 class="ml-2 text-3xl font-bold text-black dark:text-white">
    Be right
  </h1>
</div>
</template>

<script setup lang="ts">
const router = useRouter()

function redirectHome() {
  router.push('/')
}
</script>
