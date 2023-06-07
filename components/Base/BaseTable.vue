<template>
<table class="w-full mt-8 overflow-visible divide-y divide-gray-300 shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
  <thead class="w-full">
    <slot name="header" />
  </thead>

  <tbody class="divide-y divide-gray-200">
    <slot name="default" />
  </tbody>

  <tfoot
    v-if="$slots.footer"
    class="divide-y divide-gray-300"
  >
    <slot name="footer" />
  </tfoot>
</table>
</template>
