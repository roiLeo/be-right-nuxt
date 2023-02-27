<template>
<PageAuthWrapper>
  <NotificationTableList
    :notifications="notificationStore.getAllSorted"
  />
</PageAuthWrapper>
</template>

<script setup lang="ts">
import {
  useNotificationsStore,
  useUiStore,
  useUserStore,
} from '~~/store'

const { IncLoading, DecLoading } = useUiStore()
const { fetchUserNotifications } = notificationHook()
const notificationStore = useNotificationsStore()

onMounted(async () => {
  IncLoading()
  await fetchUserNotifications()
  DecLoading()
})

definePageMeta({
  layout: 'auth',
  isAuth: true,
  middleware: 'guards-middleware',
})
</script>
