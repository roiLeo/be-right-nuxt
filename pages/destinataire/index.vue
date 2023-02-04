<template>
<PageAuthWrapper>
  <EmployeeList />
</PageAuthWrapper>
</template>

<script setup lang="ts">
import { uniq } from '@antfu/utils'
import {
  useAuthStore,
  useEmployeeStore,
  useTableStore,
  useUiStore,
  useUserStore,
} from '~~/store'

const tableStore = useTableStore()
const { setFilters } = useTableStore()
const uiStore = useUiStore()
const { IncLoading, DecLoading } = uiStore
const userStore = useUserStore()
const employeeStore = useEmployeeStore()
const authStore = useAuthStore()

const { fetchAll } = employeeHook()
const { fetchMany } = userHook()

// onBeforeRouteLeave(() => {
//   setFilters(null)
// })

watch(() => tableStore.getFinalUrl, async newValue => {
  IncLoading()
  employeeStore.resetState()
  await fetchAll(newValue)
  DecLoading()
})

onMounted(async () => {
  IncLoading()

  await fetchAll(tableStore.getFinalUrl)

  if (employeeStore.getAllArray.length > 0 && authStore.isAuthUserAdmin) {
    const userIds = employeeStore.getAllArray.map(employee => employee.createdByUserId)

    if (userIds?.length > 0) {
      const uniqIds = uniq(userIds)
      const missingIds = uniqIds.filter(id => !userStore.isAlreadyInStore(id))

      if (missingIds?.length > 0) {
        await fetchMany(missingIds)
      }
    }
  }
  DecLoading()
})

definePageMeta({
  layout: 'auth',
  isAuth: true,
  middleware: 'guards-middleware',
})
</script>
