<template>
<PageAuthWrapper>
  <div class="py-4 md:py-8">
    <NotificationSubscriptionForm />

    <NotificationTableList
      :notifications="notificationStore.getAllSorted"
    />
  </div>
</PageAuthWrapper>
</template>

<script setup lang="ts">
import {
  useNotificationsStore,
  useUiStore,
} from '~~/store'

const { IncLoading, DecLoading } = useUiStore()
const { fetchUserNotificationsAndRelations } = notificationHook()

const notificationStore = useNotificationsStore()

onMounted(async () => {
  IncLoading()
  await fetchUserNotificationsAndRelations()
  DecLoading()
})

definePageMeta({
  layout: 'auth',
  isAuth: true,
  middleware: 'guards-middleware',
})
</script>
