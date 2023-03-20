<template>
<PageAuthWrapper>
  <EmployeeList />
</PageAuthWrapper>
</template>

<script setup lang="ts">
import { uniq } from '@antfu/utils'
import {
  useAuthStore,
  useCompanyStore,
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
const companyStore = useCompanyStore()

const { fetchAll, fetchMany: fetchManyEmployees } = employeeHook()
// const { fetchMany: fetchManyUsers } = userHook()

// onBeforeRouteLeave(() => {
//   setFilters(null)
// })

watch(() => tableStore.getFinalUrl, async newValue => {
  IncLoading()
  if (authStore.isAuthUserAdmin) {
    employeeStore.resetState()
    await fetchAll(newValue)
    DecLoading()
  }
})

onMounted(async () => {
  IncLoading()

  if (authStore.isAuthUserAdmin) {
    await fetchAll(tableStore.getFinalUrl)

    if (employeeStore.getAllArray.length > 0) {
      const userIds = employeeStore.getAllArray.map(employee => employee.companyId)

      if (userIds?.length > 0) {
        const uniqIds = uniq(userIds)
        const missingIds = uniqIds.filter(id => !userStore.isAlreadyInStore(id))

        if (missingIds?.length > 0) {
          // await fetchManyUsers(missingIds)
        }
      }
    }
  } else if (companyStore.getAuthCompany && companyStore.getAuthCompany.employeeIds.length > 0) {
    const missingsEmployeeIds = companyStore.getAuthCompany.employeeIds.filter(id => !employeeStore.isAlreadyInStore(id))

    if (missingsEmployeeIds?.length > 0) {
      await fetchManyEmployees(missingsEmployeeIds)
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
