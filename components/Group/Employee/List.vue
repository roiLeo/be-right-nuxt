<template>
<div class="flow-root mt-8">
  <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-10">
      <div class="relative">
        <div
          v-if="selectedPeople.length > 0"
          class="absolute top-0 flex items-center h-12 space-x-3 bg-white left-14 sm:left-12"
        >
          <button
            type="button"
            :disabled="uiStore.getUIIsLoading"
            title="Supprimer les destinataires sélectionnés de la liste"
            class="inline-flex items-center px-2 py-1 text-sm font-semibold text-gray-900 bg-white rounded shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
            @click="removeManyRecipient"
          >
            Supprimer de la liste
          </button>
        </div>
        <table class="w-full divide-y divide-gray-300 table-fixed">
          <thead>
            <tr>
              <th
                scope="col"
                class="relative px-7 sm:w-12 sm:px-6"
              >
                <input
                  type="checkbox"
                  :disabled="uiStore.getUIIsLoading"
                  class="absolute w-4 h-4 -mt-2 text-indigo-600 border-gray-300 rounded left-4 top-1/2 focus:ring-indigo-600"
                  :checked="indeterminate || selectedPeople.length === employees.length"
                  :indeterminate="indeterminate"
                  @change="selectedPeople = $event.target?.checked ? employees.map((p) => p.id) : []"
                >
              </th>
              <th
                scope="col"
                class="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
              >
                Nom
              </th>
              <th
                scope="col"
                class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Email
              </th>
              <th
                scope="col"
                class="px-3 py-3.5 text-sm font-semibold text-gray-900 text-center"
              >
                Nb de groupes
              </th>
              <th
                scope="col"
                class="px-3 py-3.5 text-sm font-semibold text-gray-900 text-center"
              >
                Nb de événements
              </th>
              <th
                scope="col"
                class="relative flex justify-end pr-2"
              >
                <BaseButton
                  color="green"
                  title="Ajouter un destinataire"
                  :disabled="uiStore.getUIIsLoading"
                  @click="openAddRecipientModal(group.id)"
                >
                  <template #icon>
                    <PlusCircleIconOutline />
                  </template>
                </BaseButton>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="person in employees"
              :key="person.email"
              :class="[selectedPeople.includes(person.id) && 'bg-gray-50']"
            >
              <td class="relative px-7 sm:w-12 sm:px-6">
                <div
                  v-if="selectedPeople.includes(person.id)"
                  class="absolute inset-y-0 left-0 w-0.5 bg-indigo-600"
                />
                <input
                  v-model="selectedPeople"
                  type="checkbox"
                  :disabled="uiStore.getUIIsLoading"
                  class="absolute w-4 h-4 -mt-2 text-indigo-600 border-gray-300 rounded left-4 top-1/2 focus:ring-indigo-600"
                  :value="person.id"
                >
              </td>
              <td
                class="py-4 pr-3 text-sm font-medium whitespace-nowrap"
                :class="[selectedPeople.includes(person.id) ? 'text-indigo-600' : 'text-gray-900']"
              >
                {{ getEmployeeFullname(person) }}
              </td>
              <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                {{ person.email }}
              </td>
              <td class="px-3 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                {{ person.groupIds?.length }}
              </td>
              <td class="px-3 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                {{ person.answersIds?.length }}
              </td>
              <td class="py-4 pl-3 pr-2 text-sm font-medium text-right whitespace-nowrap sm:pr-3">
                <NuxtLink
                  :to="{ name: 'destinataire', query: { id: person.id } }"
                  :disabled="uiStore.getUIIsLoading"
                  class="text-indigo-600 cursor-pointer hover:text-indigo-900"
                >
                  Voir<span class="sr-only">, {{ getEmployeeFullname(person) }}</span>
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import type { Group } from '~~/store'
import { useEmployeeStore, useUiStore } from '~~/store'

interface Props {
  group: Group
}

const props = defineProps<Props>()

const employeeStore = useEmployeeStore()
const uiStore = useUiStore()

const { getEmployeeFullname } = employeeHook()
const { removeRecipients, openAddRecipientModal } = groupHook()

const employees = computed(() =>
  props.group.employeeIds.length > 0
    ? alphabetical(employeeStore.getMany(props.group.employeeIds))
    : [],
)

const selectedPeople = ref<number[]>([])
const indeterminate = computed(() =>
  selectedPeople.value.length > 0
    && selectedPeople.value.length
    < employees.value.length)

async function removeManyRecipient() {
  if (selectedPeople.value.length > 0 && props.group?.id) {
    await removeRecipients(selectedPeople.value, props.group.id)
    selectedPeople.value = []
  }
}
</script>
