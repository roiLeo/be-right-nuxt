<template>
<div class="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
  <AccountBaseCard
    title="Notifications"
    description="Vous pouvez modifier vos abonnements de notifications"
  >
    <NotificationSubscriptionForm />
  </AccountBaseCard>
</div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'account',
  isAuth: true,
  middleware: 'guards-middleware',
})

const { fetchSubscriptions } = notificationSubscriptionHook()

onMounted(async () => {
  await fetchSubscriptions()
})
</script>
