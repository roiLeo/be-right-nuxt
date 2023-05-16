<template>
<div class="h-full divide-x-2 md:grid md:grid-cols-2">
  <TabGroup
    as="div"
    class="pl-2"
  >
    <TabList
      class="flex items-center mt-2 -mb-px space-x-8 border-b border-gray-200"
      aria-label="Tabs"
    >
      <Tab
        v-slot="{ selected }"
        :disabled="employeeStore.getIsEmpty"
      >
        <div
          class="px-2 py-4 font-medium whitespace-nowrap"
          :class="[selected ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
                   { 'cursor-not-allowed opacity-50': employeeStore.getIsEmpty }]"
        >
          <span>Tous les destinataires</span>
        </div>
      </Tab>
      <Tab
        v-slot="{ selected }"
        :disabled="groupStore.getIsEmpty"
      >
        <div
          class="px-2 py-4 font-medium whitespace-nowrap"
          :class="[selected ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
                   { 'cursor-not-allowed opacity-50': groupStore.getIsEmpty }]"
        >
          <span>Listes de diffusion</span>
        </div>
      </Tab>
    </TabList>
    <TabPanels>
      <TabPanel>
        <EventFormStep2
          class="px-4 lg:px-8"
          @submitEmployees="submit"
        />
      </TabPanel>
      <TabPanel>
        <EventFormGroupList />
        <div class="flex justify-center">
          <BaseButton
            :disabled="!formStore.isStepEmployeeValid"
            :is-loading="uiStore.getUIIsLoading"
            title="Passez à la suite"
            @click="submit"
          >
            <template #icon>
              <ArrowDownOnSquareIconOutline />
            </template>
            Enregistrer
          </BaseButton>
        </div>
      </TabPanel>
    </TabPanels>
  </TabGroup>

  <div class="h-full px-4 mt-4 space-y-2 lg:px-8">
    <h3 class="text-base font-semibold leading-7 text-center text-gray-800">
      {{ formStore.getEmployeeIds.length }} Destinataires choisis
    </h3>
    <div class="flex-1 min-w-0">
      <label
        for="search"
        class="sr-only"
      >Recherche</label>
      <BaseInput
        type="text"
        name="employee"
        placeholder="Recherchez"
        @keyup="query = $event.target.value"
      />
    </div>

    <ul class="h-full mt-4 space-y-2 divide-y-2">
      <li
        v-if="formStore.getEmployeeIds.length < 1"
        class="block font-medium truncate"
      >
        Aucun destinataire sélectionné
      </li>
      <template v-else>
        <li
          v-for="employee in alphabetical(filteredEmployee)"
          :key="employee.id"
          class="relative flex items-center py-2 space-x-2 text-gray-800 cursor-default select-none"
        >
          <button
            type="button"
            class="cursor-pointer"
            @click.prevent="removeEmployee(employee.id)"
          >

            <XCircleIconSolid class="w-4 h-4 text-red-500" />
          </button>
          <span class="block font-medium truncate">
            {{ getEmployeeFullname(employee) }}
          </span>
        </li>
      </template>
    </ul>
  </div>
</div>
</template>

<script setup lang="ts">
import { useEmployeeStore, useFormStore, useGroupStore, useUiStore } from '~/store'
import { RouteNames } from '~~/helpers/routes'

const router = useRouter()
const query = ref('')
const employeeStore = useEmployeeStore()
const uiStore = useUiStore()
const formStore = useFormStore()
const groupStore = useGroupStore()
const { setEmployeeIds } = formStore
const { getEmployeeFullname, filteredEmployees } = employeeHook()

const employees = computed(() => employeeStore.getMany(formStore.getEmployeeIds))

const filteredEmployee = computed(() => filteredEmployees(employees.value, query))

function removeEmployee(employeeId: number) {
  setEmployeeIds(formStore.getEmployeeIds.filter(id => id !== employeeId))
}

function submit() {
  router.push({
    name: RouteNames.CREATE_EVENT_STEP_3,
  })
}

definePageMeta({
  layout: 'create-event-layout',
  isAuth: true,
  middleware: 'guards-middleware',
})
</script>
