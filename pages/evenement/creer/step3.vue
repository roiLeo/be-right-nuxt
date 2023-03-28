<template>
<PhotographerSelect
  @submitted="submit"
/>
</template>

<script setup lang="ts">
import { RouteNames } from '~~/helpers/routes'

const router = useRouter()

function submit() {
  router.push({ name: RouteNames.CREATE_EVENT_STEP_PAYMENT })
}

definePageMeta({
  layout: 'create-event-layout',
  isAuth: true,
  middleware: 'guards-middleware',
})
</script>
