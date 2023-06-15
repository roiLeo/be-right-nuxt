<template>
<PageAuthWrapper>
  <div class="h-full px-4 my-4 sm:px-6 lg:px-8">
    <div class="flex items-start space-x-2">
      <BaseInputSearch
        id="employee-search"
        v-model="state.search"
        @update:search-query="searchEntity"
      />
      <BaseButton @click="resetFilters">
        Reset
      </BaseButton>
    </div>

    <BaseLoader
      v-if="uiStore.getUIIsLoading || !state.isDirty"
      class="mt-10"
    />

    <BaseTable v-else>
      <template #header>
        <EmployeeTableHeader />
      </template>

      <template #default>
        <EmployeeTableItem
          v-for="employee in state.items"
          :key="employee.id"
          :employee="employee"
        />
      </template>

      <template #footer>
        <BasePagination
          :total-pages="state.totalPages"
          :current-page="state.currentPage"
        />
      </template>
    </BaseTable>
  </div>
</PageAuthWrapper>
</template>

<script setup lang="ts">
import { uniq } from '@antfu/utils'
import PageAuthWrapper from '~/components/Page/PageAuthWrapper.vue'
import BasePagination from '~/components/Base/BasePagination.vue'
import BaseLoader from '~/components/Base/BaseLoader.vue'
import BaseTable from '~/components/Base/BaseTable.vue'
import EmployeeTableItem from '~~/components/Employee/Table/Item.vue'
import EmployeeTableHeader from '~~/components/Employee/Table/Header.vue'
import type { EmployeeType } from '~~/store'
import { useEmployeeStore, useUiStore } from '~~/store'
import BaseInputSearch from '~/components/Base/BaseInputSearch.vue'
import BaseButton from '~/components/Base/BaseButton.vue'

const uiStore = useUiStore()
const employeeStore = useEmployeeStore()
const { addMany } = employeeStore
const { fetchMany } = companyHook()

async function fetchRelations(items: EmployeeType[]) {
  if (items.length > 0) {
    await fetchMany(uniq(items.map(item => item.companyId)))
  }
}

const {
  state,
  resetFilters,
  searchEntity,
} = tableHook<EmployeeType>('employee', fetchRelations)

watch(() => state.items, () => {
  addMany(state.items.filter(user => !employeeStore.isAlreadyInStore(user.id)))
})

// const isModalActive = (modalName: ModalNameEnum) => computed(() =>
//   uiStore.getUiModalState.isActive
//     && uiStore.getUiModalState.modalName === modalName
//     && !uiStore.getUiModalState.isLoading)

// const userId = computed(() => {
//   if (uiStore.getUiModalState.data && uiStore.getUiModalState.data.userId) {
//     return userStore.entities.byId[uiStore.getUiModalState.data.userId].id
//   }
// })

definePageMeta({
  layout: 'auth',
  isAuth: true,
  isAdmin: true,
  middleware: ['guards-middleware'],
})
</script>
