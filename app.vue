<template>
  <div>
    <NuxtWelcome />
  </div>
  <h1 class="text-red-500">test</h1>
  <ArrowDownIconOutline />
</template>

<style>
.page-enter-active,.page-leave-active {
    transition: all 0.4s;
}
.page-enter-from,.page-leave-to {
    opacity: 0;  filter: blur(1rem);
}
</style>
