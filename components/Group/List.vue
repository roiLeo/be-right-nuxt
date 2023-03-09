<template>
<div class="flex flex-col items-center max-w-4xl">
  <div class="w-full max-w-4xl p-2 mx-auto space-y-6 bg-white rounded-2xl">
    <Disclosure
      v-for="group in groups"
      v-slot="{ open }"
      :key="group.id"
      as="div"
      class="z-20 rounded-md shadow-md"
    >
      <DisclosureButton
        class="z-20 flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-red-900 bg-red-100 rounded-lg hover:bg-red-200 focus:outline-none focus-visible:ring focus-visible:ring-red-500 focus-visible:ring-opacity-75"
      >
        <span>{{ group.name }}</span>
        <ChevronUpIconOutline
          :class="open ? 'rotate-180 transform' : ''"
          class="w-5 h-5 text-red-500"
        />
      </DisclosureButton>
      <transition
        enter-active-class="transition ease-out duration-250"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-150 ease-out"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <DisclosurePanel class="py-4 text-sm text-gray-500">
          <GroupDetailHeader
            class="-mt-4"
            :group="group"
            :nb-employee="group.employeeIds.length"
          />

          <GroupEmployeeList :group="group" />
        </DisclosurePanel>
      </transition>
    </Disclosure>
  </div>
</div>
</template>

<script setup lang="ts">
import type { Group } from '~~/store'

interface Props {
  groups: Group[]
}

withDefaults(defineProps<Props>(), {
  groups: () => [],
})
</script>
