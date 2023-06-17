<template>
<tr>
  <td class="w-8 py-2 pl-1 text-sm font-medium text-gray-900 truncate whitespace-nowrap sm:pl-6">
    {{ employee.id }}
  </td>
  <td class="py-2 pl-4 text-sm font-medium text-blue-800 truncate whitespace-nowrap">
    {{ getEmployeeFullname(employee) }}
  </td>
  <td class="px-3 py-2 text-sm text-gray-500 truncate whitespace-nowrap">
    {{ employee.createdAt ? $toFormat(employee.createdAt, 'D/MM/YYYY') : 'Jamais connecté' }}
  </td>
  <td class="px-3 py-2 text-sm text-gray-500 truncate whitespace-nowrap">
    {{ companyStore.getOne(employee?.companyId)?.name || '-' }}
  </td>
  <td class="relative py-2 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
    <EmployeeTableAction
      :employee="employee"
    />
  </td>
</tr>
</template>

<script setup lang="ts">
import EmployeeTableAction from './Actions.vue'
import { useCompanyStore } from '~/store'
import type { EmployeeType } from '@/types'

interface Props {
  employee: EmployeeType
}

defineProps<Props>()
const { getEmployeeFullname } = employeeHook()
const companyStore = useCompanyStore()
</script>
