<template>
<div class="flex flex-col items-center max-w-4xl">
  <div class="w-full max-w-4xl p-2 mx-auto space-y-6 bg-white rounded-2xl">
    <Disclosure
      v-for="group in groups"
      v-slot="{ open }"
      :key="group.id"
      as="div"
      class="z-20 rounded-md shadow-md"
      :default-open="defaultOpenGroupId === group.id"
    >
      <DisclosureButton
        class="z-20 flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-red-900 bg-red-100 rounded-lg hover:bg-red-200 focus:outline-none focus-visible:ring focus-visible:ring-red-500 focus-visible:ring-opacity-75"
        @click="setGroupIdParams(group.id)"
      >
        <span>{{ group.name }}</span>
        <ChevronUpIconOutline
          :class="open ? 'rotate-180 transform' : ''"
          class="w-5 h-5 text-red-500"
        />
      </DisclosureButton>
      <DisclosurePanel class="py-4 text-sm text-gray-500">
        <GroupDetailHeader
          class="-mt-4"
          :group="group"
          :nb-employee="group.employeeIds.length"
        />

        <GroupEmployeeList :group="group" />
      </DisclosurePanel>
    </Disclosure>
  </div>
</div>
</template>

<script setup lang="ts">
import GroupDetailHeader from '~~/components/Group/Detail/header.vue'
import GroupEmployeeList from '~~/components/Group/Employee/List.vue'
import type { Group } from '~~/store'

interface Props {
  groups: Group[]
  defaultOpenGroupId?: number
}

withDefaults(defineProps<Props>(), {
  groups: () => [],
})

const { $router } = useNuxtApp()

function setGroupIdParams(groupId: number) {
  $router.push({
    query: {
      groupId,
    },
  })
}
</script>
