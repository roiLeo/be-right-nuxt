<template>
<div>
  <GroupDetailHeader
    class="-mt-6"
    :group="group"
    :nb-employee="employees.length"
  />

  <div class="px-4 mt-4 sm:px-6 lg:px-14 xl:px-24">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <p class="mt-2 text-sm text-gray-700">
          {{ group.description }}
        </p>
      </div>
    </div>
    <GroupEmployeeList :group="group" />
  </div>
</div>
</template>

<script setup lang="ts">
import type { Group } from '~~/store'
import { useEmployeeStore } from '~~/store'

interface Props {
  group: Group
}

const props = defineProps<Props>()

const employeeStore = useEmployeeStore()

const employees = computed(() =>
  props.group.employeeIds.length > 0
    ? alphabetical(employeeStore.getMany(props.group.employeeIds))
    : [],
)
</script>
