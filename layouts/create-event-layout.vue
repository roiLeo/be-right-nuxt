<template>
<main class="flex min-h-screen bg-white dark:bg-blue-dark">
  <MenuDrawer />

  <div class="w-full lg:ml-64">
    <HeaderDashboard />
    <PageAuthWrapper>
      <EventFormStepperWrapper />

      <div
        v-if="!haveUserEmployees"
        class="flex items-center justify-center my-4"
      >
        <BaseMessage type="warning">
          <div class="flex flex-col items-center">
            <p>Attention vous devez créer des destinataires avant de créer un événement</p>
            <BaseButton
              class="mt-4"
              :href="{ name: RouteNames.EMPLOYEE_CREATE }"
            >
              Créer un destinataire
            </BaseButton>
          </div>
        </BaseMessage>
      </div>

      <slot />
    </PageAuthWrapper>

    <AddEmployeeModal
      v-if="uiStore.isModalActive(ModalNameEnum.ADD_RECIPIENT_TO_EVENT)"
      :is-active="uiStore.isModalActive(ModalNameEnum.ADD_RECIPIENT_TO_EVENT)"
    />

    <PhotographerModal
      v-if="uiStore.getUiModalState.isActive
        && uiStore.getUiModalState.modalName === ModalNameEnum.CREATE_PHOTOGRAPHER"
      :is-active="uiStore.getUiModalState.isActive
        && uiStore.getUiModalState.modalName === ModalNameEnum.CREATE_PHOTOGRAPHER"
      @close="resetUiModalState"
    />
  </div>
</main>
</template>

<script setup lang="ts">
import AddEmployeeModal from '~~/components/Event/Form/AddEmployeeModal.vue'
import { RouteNames } from '~~/helpers/routes'
import {
  ModalNameEnum,
  useAuthStore,
  useCompanyStore,
  useEmployeeStore,
  useGroupStore,
  useUiStore,
} from '~~/store'

const employeeStore = useEmployeeStore()
const authStore = useAuthStore()
const companyStore = useCompanyStore()
const groupStore = useGroupStore()
const uiStore = useUiStore()
const { resetUiModalState, IncLoading, DecLoading } = uiStore

const { getPhotographerUserWorkedWith } = userHook()
const { fetchMany: fetchManyEmployees } = employeeHook()
const { fetchMany: fetchManyGroups } = groupHook()

const haveUserEmployees = computed(() => {
  if (!authStore.isAuthUserAdmin) {
    return employeeStore.getAllArray.length > 0
  }
  return true
})

onMounted(async () => {
  IncLoading()
  if (!authStore.isAuthUserAdmin
    && companyStore.getAuthCompany
    && companyStore.getAuthCompany.employeeIds.length > 0) {
    const missingsEmployeeIds = companyStore.getAuthCompany.employeeIds.filter(id => !employeeStore.isAlreadyInStore(id))

    if (missingsEmployeeIds?.length > 0) {
      await fetchManyEmployees(missingsEmployeeIds)
    }
    await getPhotographerUserWorkedWith()

    const missingGroupIds = companyStore.getAuthCompany.groupIds.filter(id => !groupStore.isAlreadyInStore(id))
    if (missingGroupIds.length > 0) {
      await fetchManyGroups(missingGroupIds)
    }
  }
  DecLoading()
})
</script>
