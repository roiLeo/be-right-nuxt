<template>
<PageAuthWrapper>
  <div class="h-full px-4 mt-4 sm:px-6 lg:px-8">
    <div class=" sm:flex-col lg:flex-row lg:items-center">
      <BaseInputSearch
        id="user-search"
        v-model="state.search"
        @update:search-query="searchEntity"
      />

      <div class="flex items-center justify-between">
        <UserTableFilters @setFilter="setUserRoleFilter" />

        <div class="flex items-center space-x-2">
          <BaseButton
            :is-loading="uiStore.getUIIsLoading"
            :disabled="uiStore.getUIIsLoading"
            @click="resetFilters"
          >
            Reset Filters
          </BaseButton>
          <BaseLimitSelector
            :default-limit="state.limit"
            @update:limit="updateLimit"
          />
        </div>
      </div>
    </div>

    <BaseLoader
      v-if="uiStore.getUIIsLoading || !state.isDirty"
      class="mt-10"
    />

    <BaseTable v-else>
      <template #header>
        <UserTableHeader />
      </template>

      <template #default>
        <UserTableItem
          v-for="user in state.items"
          :key="user.id"
          :user="user"
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

  <AddEmployeeToUserModal
    v-if="userId && isModalActive(ModalNameEnum.ADD_EMPLOYEE_USER).value"
    :is-active="(noNull(userId) && noUndefined(userId)) && isModalActive(ModalNameEnum.ADD_EMPLOYEE_USER).value"
    :user-id="userId"
  />
</PageAuthWrapper>
</template>

<script setup lang="ts">
import PageAuthWrapper from '~/components/Page/PageAuthWrapper.vue'
import BaseButton from '~/components/Base/BaseButton.vue'
import BasePagination from '~/components/Base/BasePagination.vue'
import BaseLoader from '~/components/Base/BaseLoader.vue'
import BaseTable from '~/components/Base/BaseTable.vue'
import UserTableItem from '~~/components/User/Table/Item.vue'
import UserTableHeader from '~~/components/User/Table/Header.vue'
import BaseInputSearch from '~/components/Base/BaseInputSearch.vue'
import BaseLimitSelector from '~/components/Base/BaseLimitSelector.vue'
import AddEmployeeToUserModal from '~/components/User/AddEmployeeToUserModal.vue'
import type { UserType } from '~~/store'
import { useUiStore, useUserStore } from '~~/store'
import { ModalNameEnum } from '~/types'
import type { RoleEnum } from '~/types'

const uiStore = useUiStore()
const userStore = useUserStore()
const { addMany } = userStore

const { fetchMany } = companyHook()

async function fetchRelations(items: UserType[]) {
  if (items.length > 0) {
    await fetchMany(items.map(item => item.companyId))
  }
}

const {
  resetFilters,
  searchEntity,
  setFilter,
  state,
  updateLimit,
} = tableHook<UserType>('admin/user', fetchRelations)

watch(() => state.items, () => {
  addMany(state.items.filter(user => !userStore.isAlreadyInStore(user.id)))
})

const isModalActive = (modalName: ModalNameEnum) => computed(() =>
  uiStore.getUiModalState.isActive
  && uiStore.getUiModalState.modalName === modalName
  && !uiStore.getUiModalState.isLoading)

const userId = computed(() => {
  if (uiStore.getUiModalState.data && uiStore.getUiModalState.data.userId) {
    return userStore.entities.byId[uiStore.getUiModalState.data.userId].id
  }
})

function setUserRoleFilter(roles: RoleEnum | undefined) {
  if (roles) {
    setFilter({ roles })
  } else {
    state.filters = null
  }
}

definePageMeta({
  layout: 'auth',
  isAuth: true,
  isAdmin: true,
  middleware: ['guards-middleware'],
})
</script>
