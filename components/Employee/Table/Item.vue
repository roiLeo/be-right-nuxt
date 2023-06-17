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
  <td class="flex justify-end py-2 pl-3 pr-4 text-sm font-medium sm:pr-6">
    <NuxtLink
      class="flex items-center px-3 py-3 text-sm text-purple-800 bg-purple-100 rounded-md group"
      :data-cy="`employee-${employee.id}-show-link`"
      :to="{
        name: RouteNames.ADMIN_EMPLOYEE_SHOW,
        params: {
          id: employee.id,
        },
      }"
    >
      <PencilSquareIconOutline
        class="w-5 h-5 mr-2 text-violet-800"
        aria-hidden="true"
      />
      Voir
    </NuxtLink>
  </td>
</tr>
</template>

<script setup lang="ts">
import { RouteNames } from '~/helpers/routes'
import { useCompanyStore } from '~/store'
import type { EmployeeType } from '@/types'

interface Props {
  employee: EmployeeType
}

defineProps<Props>()
const { getEmployeeFullname } = employeeHook()
const companyStore = useCompanyStore()
</script>
