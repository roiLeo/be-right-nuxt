<template>
<div class="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
  <AccountBaseCard
    title="Mon profile"
    description="Vous pouvez modifier vos données personnelles"
  >
    <div class="px-4 mt-6">
      <UserForm :user="userStore.getAuthUser" />
    </div>
  </AccountBaseCard>

  <AccountBaseCard
    title="Mon entreprise"
    description="Vous pouvez modifier vos données entreprise"
  >
    <div class="px-4 mt-6">
      <AccountCompanyForm :company="companyStore.getAuthCompany" />
    </div>
  </AccountBaseCard>

  <AccountBaseCard
    title="Adresse de l'entreprise"
    description="Vous pouvez modifier l'adresse de l'entreprise"
  >
    <div class="px-4 mt-6">
      <AddressForm :address="companyAddress" />
    </div>
  </AccountBaseCard>
</div>
</template>

<script setup lang="ts">
import { useAddressStore, useCompanyStore, useUiStore, useUserStore } from '~~/store'

const userStore = useUserStore()
const companyStore = useCompanyStore()
const addressStore = useAddressStore()
const { IncLoading, DecLoading } = useUiStore()

const companyAddress = computed(() => {
  if (companyStore.getAuthCompany) {
    return addressStore.getOne(companyStore.getAuthCompany.addressId)
  }
})

const { fetchOne: fetchOneAddress } = addressHook()
const { fetchOne: fetchOneCompany } = companyHook()

onMounted(async () => {
  IncLoading()

  if (!companyStore.getAuthCompany && userStore.getAuthUser?.companyId) {
    await fetchOneCompany(userStore.getAuthUser?.companyId)
  }

  if (!companyAddress.value && companyStore.getAuthCompany?.addressId) {
    await fetchOneAddress(companyStore.getAuthCompany.addressId)
  }

  DecLoading()
})

definePageMeta({
  layout: 'account',
  isAuth: true,
  middleware: 'guards-middleware',
})
</script>
