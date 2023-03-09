<template>
<div class="flex flex-col space-y-2 md:col-span-2">
  <p>is Dirty = {{ meta.dirty }}</p>
  <p>is valid = {{ meta.valid }}</p>
  <p
    v-for="error in errors"
    :key="error"
    class="text-red-500"
  >
    {{ error }}
  </p>
</div>
</template>

<script setup lang="ts">
import type { FormMeta } from 'vee-validate'

interface Props {
  errors: Partial<Record<string, string | undefined>>
  meta: FormMeta<Record<string, any>>
}

defineProps<Props>()
</script>
