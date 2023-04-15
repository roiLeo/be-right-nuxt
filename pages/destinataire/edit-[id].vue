<template>
<PageAuthWrapper>
  <div class="flex px-4 mx-auto mb-8 lg:px-8">
    <EmployeeForm
      v-if="!uiStore.isLoading"
      :mode="ModalModeEnum.EDIT"
      :employee="employee"
      :address="employeeAddress"
    />
    <BaseLoader v-else />
  </div>
</PageAuthWrapper>
</template>

<script setup lang="ts">
import { useAddressStore, useAuthStore, useEmployeeStore, useUiStore } from '~~/store'
import { ModalModeEnum } from '@/types'

const authStore = useAuthStore()
const { fetchAll } = userHook()
const route = useRoute()
const employeeStore = useEmployeeStore()
const addressStore = useAddressStore()
const uiStore = useUiStore()
const { fetchOne: fetchOneEvent } = employeeHook()
const { fetchOne: fetchOneAddress } = addressHook()

const employeeId = route.name === 'destinataire-edit-id' && parseInt(route.params.id.toString())

const employee = computed(() => {
  if (employeeId) {
    return employeeStore.getOne(employeeId)
  }
  return null
})

const employeeAddress = computed(() =>
  employee.value?.addressId ? addressStore.getOne(employee.value?.addressId) : null)

onMounted(async () => {
  if (employeeId && !employeeStore.isAlreadyInStore(employeeId)) {
    await fetchOneEvent(employeeId)
  }

  if (employee.value?.addressId) {
    await fetchOneAddress(employee.value?.addressId)
  }

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
