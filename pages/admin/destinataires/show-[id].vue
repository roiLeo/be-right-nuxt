<template>
<PageAuthWrapper>
  <EmployeeDetails
    v-if="!uiStore.isLoading && employeeId"
    :employee="employeeStore.getOne(employeeId)"
  />

  <div
    v-else
    class="mt-8"
  >
    <BaseLoader />
  </div>
</PageAuthWrapper>
</template>

<script setup lang="ts">
import PageAuthWrapper from '~/components/Page/PageAuthWrapper.vue'
import EmployeeDetails from '~/components/Employee/EmployeeDetails.vue'
import BaseLoader from '~/components/Base/BaseLoader.vue'
import {
  useAddressStore,
  useCompanyStore,
  useEmployeeStore,
  useGroupStore,
  useUiStore,
  useUserStore,
} from '~~/store'

const employeeStore = useEmployeeStore()
const uiStore = useUiStore()
const groupStore = useGroupStore()
const addressStore = useAddressStore()
const companyStore = useCompanyStore()
const userStore = useUserStore()

const { $router } = useNuxtApp()

const { getEmployeeFullname, fetchOne: fetchOneEmployee } = employeeHook()
const { fetchMany: fetchManyGroups } = groupHook()
const { fetchOne: fetchOneAddress } = addressHook()
const { fetchOne: fetchOneCompany } = companyHook()
const { fetchMany: fetchManyUsers } = userHook()

const employeeId = $router.currentRoute.value.name === 'admin-destinataires-show-id'
&& parseInt($router.currentRoute.value.params.id.toString())

useHead({
  title: employeeStore.isAlreadyInStore(employeeId)
    ? getEmployeeFullname(employeeStore.getOne(employeeId))
    : 'Voir détails destinataire',
})

onMounted(async () => {
  if (employeeId && !employeeStore.isAlreadyInStore(employeeId)) {
    await fetchOneEmployee(employeeId)
  }

  const employee = employeeStore.getOne(employeeId)
  if (employee && groupStore.getMissingIds(employee.groupIds).length > 0) {
    await fetchManyGroups(groupStore.getMissingIds(employee.groupIds))
  }

  if (employee.addressId && !addressStore.isAlreadyInStore(employee.addressId)) {
    await fetchOneAddress(employee.addressId)
  }

  if (employee.companyId && !companyStore.isAlreadyInStore(employee.companyId)) {
    await fetchOneCompany(employee.companyId)
  }

  const company = companyStore.getOne(employee.companyId)
  if (company) {
    await fetchManyUsers(userStore.getMissingIds(company.userIds))
  }
})

definePageMeta({
  layout: 'auth',
  isAuth: true,
  isAdmin: true,
  middleware: ['guards-middleware'],
})
</script>
