<template>
<div class="relative z-0 flex flex-col flex-1 overflow-hidden md:flex-row">
  <EmployeeDetails
    v-if="!state.isLoading && state.activeEmployee"
    :employee="activeEmployee"
  />

  <BaseLoader
    v-else-if="state.isLoading"
    class="mt-12"
  />

  <div
    v-else
    class="flex flex-col items-center justify-center w-full space-y-4"
  >
    <h5 class="text-3xl font-bold leading-8 tracking-tight text-center text-gray-900 sm:text-4xl">
      {{ getGeneralText }}
    </h5>
    <BaseButton
      v-if="employees.length === 0"
      :href="{ name: 'destinataire-create' }"
    >
      <template #icon>
        <UserPlusIconOutline />
      </template>
      Créer un destinataire
    </BaseButton>
  </div>

  <aside class="order-first border-r border-gray-200 md:flex-shrink-0 xl:flex xl:flex-col w-96">
    <div class="px-6 pt-6 pb-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-medium text-gray-900">
          {{ authStore.isAuthUserAdmin ? 'Liste des destinataires' : 'Liste de vos destinataires' }}
        </h2>
        <p class="text-gray-500">
          {{ filteredEmployee.length === employees.length ? filteredEmployee.length : `${filteredEmployee.length}/${employees.length}` }}
        </p>
      </div>
      <form
        class="flex mt-6 space-x-4"
      >
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
      </form>
    </div>
    <!-- Employee list -->
    <nav
      class="flex-1 max-h-screen min-h-0 overflow-y-auto"
      aria-label="Employee"
    >
      <template v-if="employees.length > 0">
        <div
          v-for="letter in Object.keys(alphabeticalAmployeeList)"
          :key="letter"
          class="relative"
        >
          <div class="sticky top-0 z-10 px-6 py-1 text-sm font-medium text-gray-500 border-t border-b border-gray-200 bg-gray-50">
            <h3>{{ letter }}</h3>
          </div>
          <ul
            role="list"
            class="relative z-0 divide-y divide-gray-200"
          >
            <!-- TODO max height -->
            <EmployeeItem
              v-for="employee in alphabeticalAmployeeList[letter]"
              :key="employee.id"
              :employee="employee"
              :class="{ 'bg-gray-100': employee.id === state.activeEmployee }"
              @click="setActiveEmployee(employee)"
            />
          </ul>
        </div>
      </template>
      <p
        v-else
        class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 truncate whitespace-nowrap sm:pl-6"
      >
        {{ authStore.isAuthUserAdmin
          ? 'Aucun destinataire enregistré dans la base de donnée'
          : 'Vous n\'avez pas de destinataire enregistré dans la base de donnée'
        }}
      </p>
    </nav>
  </aside>
</div>
</template>

<script setup lang="ts">
import { alphabetical } from '~/utils/arrayUtils'
import type { EmployeeType } from '@/types'
import {
  useAuthStore,
  useEmployeeStore,
} from '~~/store'

const authStore = useAuthStore()
const employeeStore = useEmployeeStore()
const route = useRoute()
const { filteredEmployees } = employeeHook()

const employees = computed(() => alphabetical(employeeStore.getAllArray) as EmployeeType[])

const query = ref('')
const state = reactive({
  isLoading: false,
  activeEmployee: employees.value[0]?.id || null,
  isActiveEmployeeDirty: false,
})

onMounted(() => {
  if (route.query.id) {
    state.activeEmployee = parseInt(route.query.id.toString()) || employees.value[0]?.id
  }
})

const activeEmployee = computed(() => {
  if (state.activeEmployee) {
    return employeeStore.getOne(state.activeEmployee)
  }
  return null
})

const filteredEmployee = computed(() => filteredEmployees(employees.value, query))

const alphabeticalAmployeeList = computed(() => {
  return filteredEmployee.value.reduce((acc: Record<string, EmployeeType[]>, employee: EmployeeType) => {
    const letter = employee.lastName[0].toUpperCase()
    if (!acc[letter]) {
      acc[letter] = []
    }
    acc[letter].push(employee)
    return acc
  }, {})
})

function setActiveEmployee(employee: EmployeeType) {
  state.isLoading = true
  state.isActiveEmployeeDirty = true
  state.activeEmployee = employee.id
  state.isLoading = false
}

const getGeneralText = computed(() => {
  if (employees.value?.length === 0) {
    return 'Vous n\'avez pas de destinataires'
  }
  if (!state.isActiveEmployeeDirty) {
    return 'Vous n\'avez pas séléctionné de destinataire'
  }
})
</script>
