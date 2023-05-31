<template>
<div class="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
  <AccountBaseCard
    title="Utilisateurs"
    description="Vous pouvez modifier vos comptes liés"
  >
    <AccountUserTableList :users="users" />
  </AccountBaseCard>
</div>
</template>

<script setup lang="ts">
import { uniq } from '@antfu/utils'
import AccountBaseCard from '~~/components/Account/BaseCard.vue'
import AccountUserTableList from '~~/components/Account/UserTable/List.vue'
import type { Company } from '~~/store'
import { useCompanyStore, useUiStore, useUserStore } from '~~/store'

const userStore = useUserStore()
const companyStore = useCompanyStore()
const { IncLoading, DecLoading } = useUiStore()

const { fetchMany } = userHook()
const { fetchOne } = companyHook()

const users = computed(() => userStore.getAllArray)

onMounted(async () => {
  IncLoading()

  let company: null | Company = null

  const companyId = userStore.getAuthUser?.companyId

  if (!companyStore.isAlreadyInStore(companyId) && companyId) {
    await fetchOne(companyId)
  }
  company = companyStore.getOne(companyId)

  if (company?.users) {
    const missingUserIds = uniq(company?.users?.map(user => user.id).filter(id => !userStore.isAlreadyInStore(id)))

    if (missingUserIds && missingUserIds.length > 0) {
      await fetchMany(missingUserIds)
    }
  }
  DecLoading()
})

definePageMeta({
  layout: 'account',
  isAuth: true,
  middleware: 'guards-middleware',
})
</script>
