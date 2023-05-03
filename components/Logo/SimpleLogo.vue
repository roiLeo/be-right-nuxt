<template>
<div
  class="flex items-center justify-center w-full cursor-pointer"
  @click="redirectHome"
>
  <div class="flex items-center justify-center w-10 h-10 border-4 rounded-full border-red">
    <div class="flex items-center justify-center border-4 rounded-full w-7 h-7 border-red">
      <div class="w-4 h-4 rounded-full bg-red-light" />
    </div>
  </div>
  <p class="ml-2 text-3xl font-bold text-black dark:text-white">
    BeRight
  </p>
</div>
</template>

<script setup lang="ts">
const router = useRouter()

function redirectHome() {
  router.push('/')
}
</script>
