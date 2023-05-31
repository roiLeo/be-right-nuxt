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
    v-if="companyStore.getAuthCompany"
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

  <AccountBaseCard
    title="Votre Signature"
    description="Vous pouvez ajouter votre signature par default."
  >
    <div class="px-4 mt-6">
      <SignatureForm
        :signature="userStore.getAuthUser?.signature || undefined"
        @save="saveUserSignature"
      />
    </div>
  </AccountBaseCard>
</div>
</template>

<script setup lang="ts">
import SignatureForm from '~~/components/Signature/SignatureForm.vue'
import AccountBaseCard from '~~/components/Account/BaseCard.vue'
import AccountCompanyForm from '~~/components/Account/CompanyForm.vue'
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
const { postUserSignature } = userHook()

async function saveUserSignature(str: string) {
  if (userStore.getAuthUserId) {
    await postUserSignature(str, userStore.getAuthUserId)
  }
}

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
