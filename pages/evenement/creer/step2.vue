<template>
<EventFormStep2
  class="px-4 lg:px-8"
  @submitEmployees="submit"
/>
</template>

<script setup lang="ts">
import { RouteNames } from '~~/helpers/routes'

const router = useRouter()

function submit() {
  router.push({
    name: RouteNames.CREATE_EVENT_STEP_3,
  })
}

definePageMeta({
  layout: 'create-event-layout',
  isAuth: true,
  middleware: 'guards-middleware',
})
</script>
