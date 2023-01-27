<template>
<PageAuthWrapper>
  <div class="flex px-4 mx-auto mb-8 lg:px-8">
    <EmployeeForm />
  </div>
</PageAuthWrapper>
</template>

<script setup lang="ts">
import { useAuthStore } from '~~/store'

const authStore = useAuthStore()
const { fetchAll } = userHook()

onMounted(async () => {
  if (authStore.isAuthUserAdmin) {
    await fetchAll('?limit=9999')
  }
})

definePageMeta({
  layout: 'auth',
  isAuth: true,
  middleware: 'guards-middleware',
})
</script>
