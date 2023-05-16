<template>
<ul class="px-4 py-4 space-y-2 divide-y-2">
  <li v-if="groupStore.getIsEmpty">
    Aucune liste
  </li>
  <template v-else>
    <li
      v-for="group in groupStore.getNotEmptyGroups"
      :key="group.id"
      class="relative py-2 space-x-2"
    >
      <Disclosure v-slot="{ open }">
        <div class="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-purple-900 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
          <label :id="`${group.name}-${group.id}`">
            <input
              type="checkbox"
              :disabled="uiStore.getUIIsLoading"
              :aria-labelledby="`${group.name}-${group.id}`"
              class="w-4 h-4 -mt-2 text-indigo-600 border-gray-300 rounded left-4 focus:ring-indigo-600"
              :checked="allEmployeeGroupSelected(group).value"
              @change="toggleAllFromGroup(group)"
            >
            <span class="ml-2">{{ group.name }}</span>
          </label>
          <DisclosureButton class="inline-flex space-x-1">
            <span>{{ open ? 'Fermer' : 'Ouvrir' }}</span>
            <ChevronUpIconOutline
              :class="open ? 'rotate-180 transform' : ''"
              class="w-5 h-5 text-purple-500"
            />
          </DisclosureButton>
        </div>
        <DisclosurePanel class="px-4 pt-4 pb-2 text-sm text-gray-500">
          <ul class="pl-3 space-y-2">
            <li
              v-for="employee in groupEmployees(group).value"
              :key="`${group.id}-${employee.id}`"
            >
              <label :id="`${group.name}-${employee.id}`">
                <input
                  type="checkbox"
                  :disabled="uiStore.getUIIsLoading"
                  :aria-labelledby="`${group.name}-${employee.id}`"
                  class="w-4 h-4 -mt-2 text-indigo-600 border-gray-300 rounded left-4 focus:ring-indigo-600"
                  :checked="formStore.getEmployeeIds.includes(employee.id)"
                  @change="toggleEmployee(employee.id)"
                >
                <span class="ml-2">{{ getEmployeeFullname(employee) }}</span>
              </label>
            </li>
          </ul>
        </DisclosurePanel>
      </Disclosure>
    </li>
  </template>
</ul>
</template>

<script setup lang="ts">
import type { Group } from '~/store'
import {
  useEmployeeStore,
  useFormStore,
  useGroupStore,
  useUiStore,
} from '~/store'

const groupStore = useGroupStore()
const employeeStore = useEmployeeStore()
const uiStore = useUiStore()
const formStore = useFormStore()
const { mergeEmployeeIds, removeEmployeeIds } = formStore
const { getEmployeeFullname } = employeeHook()

const allEmployeeGroupSelected = (group: Group) => computed(() => group.employeeIds.every(id => formStore.getEmployeeIds.includes(id)))
const groupEmployees = (group: Group) => computed(() => employeeStore.getMany(group.employeeIds))

function toggleAllFromGroup(group: Group) {
  if (allEmployeeGroupSelected(group).value) {
    removeEmployeeIds(group.employeeIds)
  } else {
    mergeEmployeeIds(group.employeeIds)
  }
}

function toggleEmployee(employeeId: number) {
  if (formStore.getEmployeeIds.includes(employeeId)) {
    removeEmployeeIds([employeeId])
  } else {
    mergeEmployeeIds([employeeId])
  }
}
</script>
