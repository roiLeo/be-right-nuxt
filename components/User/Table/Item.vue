<template>
<tr>
  <td class="py-2 text-sm font-medium text-gray-900 truncate whitespace-nowrap sm:pl-6">
    {{ user.id }}
  </td>
  <td class="py-2 pl-4 text-sm font-medium text-gray-900 truncate whitespace-nowrap">
    {{ getUserfullName(user) }}
  </td>
  <td class="px-3 py-2 text-sm text-gray-500 truncate whitespace-nowrap">
    <UserRoleTag :role="user.roles" />
  </td>
  <td class="px-3 py-2 text-sm text-gray-500 truncate whitespace-nowrap">
    {{ user.createdAt ? $toFormat(user.createdAt, 'D/MM/YYYY') : 'Jamais connecté' }}
  </td>
  <td class="px-3 py-2 text-sm text-gray-500 truncate whitespace-nowrap">
    {{ company?.name }}
  </td>
  <td class="relative py-2 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
    <UserTableAction
      :user="user"
      :disabled="userStore.getAuthUserId === user.id"
    />
  </td>
</tr>
</template>

<script setup lang="ts">
import UserRoleTag from '../UserRoleTag.vue'
import UserTableAction from './Action.vue'
import { useCompanyStore, useUserStore } from '~/store'
import type { UserType } from '@/types'

interface Props {
  user: UserType
}

const props = defineProps<Props>()
const { getUserfullName } = userHook()
const companyStore = useCompanyStore()
const userStore = useUserStore()

const company = computed(() => props.user?.companyId
  ? companyStore.getOne(props.user?.companyId)
  : null)
</script>
