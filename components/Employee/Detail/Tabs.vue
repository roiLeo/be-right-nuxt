<template>
<TabGroup :default-index="0">
  <TabList
    class="flex items-center px-8 mt-6 -mb-px space-x-8 border-b border-gray-200"
    aria-label="Tabs"
  >
    <Tab
      v-slot="{ selected }"
    >
      <div
        class="px-1 py-4 font-medium border-b-2 whitespace-nowrap"
        :class="[selected ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200']"
      >
        <span>Événements</span>
        <span
          class="hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block"
          :class="[selected ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-900']"
        >{{
          employeeEvents.length
        }}</span>
      </div>
    </Tab>
    <Tab
      v-slot="{ selected }"
    >
      <div
        class="px-1 py-4 font-medium border-b-2 whitespace-nowrap"
        :class="[selected ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
        ]"
      >
        <span>Groupes / Listes</span>
        <span
          class="hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block"
          :class="[selected ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-900']"
        >0</span>
      </div>
    </Tab>
  </TabList>
  <TabPanels
    as="div"
    class="px-8 py-2"
  >
    <TabPanel>
      <EmployeeEventList
        :events="employeeEvents"
        :employee-id="employee?.id"
      />
    </TabPanel>
    <TabPanel>
      Groupes
    </TabPanel>
  </TabPanels>
</TabGroup>
</template>

<script setup lang="ts">
import type { EmployeeType } from '@/types'
import {
  useEventStore,
} from '~~/store'

interface Props {
  employee: EmployeeType | null
}

const props = defineProps<Props>()

const eventStore = useEventStore()
const employeeEvents = computed(() =>
  props.employee ? eventStore.getAllByEmployee(props.employee?.id) : [])
</script>
