<template>
<PageAuthWrapper>
  <div class="px-4 py-2 mx-auto mb-8 space-y-1 lg:px-8">
    <BaseCard
      v-if="employee"
      class="space-y-2"
      title="Informations personnelles"
    >
      <EmployeeEditForm :employee="employee" />
    </BaseCard>

    <BaseCard
      v-if="employeeAddress"
      class="space-y-2"
      title="Adresse du destinataire"
    >
      <AddressForm
        class="px-4"
        :address="employeeAddress"
      />
    </BaseCard>
  </div>
</PageAuthWrapper>
</template>

<script setup lang="ts">
import BaseCard from '~/components/Account/BaseCard.vue'
import EmployeeEditForm from '~/components/Employee/EmployeeEditForm.vue'
import AddressForm from '~/components/address/AddressForm.vue'
import { useAddressStore, useEmployeeStore } from '~~/store'

const route = useRoute()
const employeeStore = useEmployeeStore()
const addressStore = useAddressStore()
const { fetchOne: fetchOneEmployee, getEmployeeFullname } = employeeHook()
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
    await fetchOneEmployee(employeeId)
  }

  if (employee.value?.addressId) {
    await fetchOneAddress(employee.value?.addressId)
  }
})

useHead({
  title: employeeStore.isAlreadyInStore(employeeId)
    ? `Modifier ${getEmployeeFullname(employeeStore.getOne(employeeId))}`
    : 'Modifier un destinataire',
})

definePageMeta({
  layout: 'auth',
  isAuth: true,
  middleware: 'guards-middleware',
})
</script>
