<template>
<PageAuthWrapper>
  <div class="flex justify-center">
    <GroupFormCSV />
  </div>
</PageAuthWrapper>
</template>

<script setup lang="ts">
import GroupFormCSV from '~~/components/Group/GroupFormCSV.vue'

const { fetchUserGroupsAndRelations } = groupHook()

onMounted(async () => {
  await fetchUserGroupsAndRelations()
})

definePageMeta({
  layout: 'auth',
  isAuth: true,
  middleware: 'guards-middleware',
})
</script>
