<template>
<div class="inline-block min-w-full py-2 align-middle">
  <div class="relative">
    <div
      v-if="selectedPeople.length > 0"
      class="absolute top-0 flex items-center h-12 space-x-3 bg-white left-14 sm:left-12"
    >
      <button
        type="button"
        :disabled="isDisabled"
        :is-loading="uiStore.getUIIsLoading"
        :title="authStore.isAuthUserOwner ? 'Supprimer le compte de l\'utlisateur' : 'Fonctionnalité non disponible'"
        class="inline-flex items-center px-2 py-1 text-sm font-semibold text-gray-900 bg-white rounded shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
      >
        <!-- @click="removeManyRecipient" -->
        Supprimer du compte
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
              :disabled="isDisabled"
              class="absolute w-4 h-4 -mt-2 text-indigo-600 border-gray-300 rounded left-4 top-1/2 focus:ring-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
              :checked="indeterminate || selectedPeople.length === usersSorted.length"
              :indeterminate="indeterminate"
              @change="selectAll"
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
            Rôle
          </th>
          <th
            scope="col"
            class="relative flex justify-end pr-2"
          >
            <BaseButton
              color="green"
              :title="authStore.isAuthUserOwner ? 'Ajouter un destinataire' : 'Fonctionnalité non disponible'"
              :disabled="isDisabled"
              :is-loading="uiStore.getUIIsLoading"
              @click="createNewUser"
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
          v-for="person in usersSorted"
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
              :disabled="isDisabled || userStore.getAuthUserId === person.id || isUserAdmin(person)"
              class="absolute w-4 h-4 -mt-2 text-indigo-600 border-gray-300 rounded left-4 top-1/2 focus:ring-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
              :value="person.id"
            >
          </td>
          <td
            class="py-4 pr-3 text-sm font-medium truncate whitespace-nowrap"
            :title="`${getUserfullName(person)}${userStore.getAuthUserId === person.id ? '-(moi même)' : ''}`"
            :class="[selectedPeople.includes(person.id) ? 'text-indigo-600' : 'text-gray-900']"
          >
            {{ getUserfullName(person) }} {{ userStore.getAuthUserId === person.id ? '(moi même)' : '' }}
          </td>
          <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
            {{ person.email }}
          </td>
          <td class="flex items-center justify-center px-3 py-4 whitespace-nowrap">
            <UserRoleTag :role="person.roles" />
          </td>
          <td class="py-4 pl-3 pr-2 text-sm font-medium text-right whitespace-nowrap sm:pr-3">
            <button
              :disabled="isDisabled || userStore.getAuthUserId === person.id || isUserAdmin(person)"
              class="text-indigo-600 cursor-pointer hover:text-indigo-900 disabled:cursor-not-allowed disabled:opacity-50"
              :class="{ isDisabled: 'cursor-not-allowed opacity-50' }"
              :title="getButtonTitle(person.roles).value"
              @click="addOrRemoveOwner(person.id)"
            >
              Changer le rôle<span class="sr-only">, {{ getUserfullName(person) }}</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script setup lang="ts">
import type { UserType } from '~~/store'
import { useAuthStore, useUiStore, useUserStore } from '~~/store'
import { ModalModeEnum, ModalNameEnum, RoleEnum } from '~~/types'

interface Props {
  users: UserType[]
}

const props = defineProps<Props>()

const uiStore = useUiStore()
const { setUiModal } = uiStore
const authStore = useAuthStore()
const userStore = useUserStore()

const { getUserfullName, isUserAdmin } = userHook()
const { addOrRemoveOwner } = companyHook()

const usersSorted = computed(() =>
  props.users?.length
    ? alphabetical(props.users)
    : [],
)

const selectedPeople = ref<number[]>([])
const indeterminate = computed(() =>
  selectedPeople.value.length > 0
      && selectedPeople.value.length
      < usersSorted.value.length)

const isDisabled = computed(() => uiStore.getUIIsLoading || !authStore.isAuthUserOwner)

const getButtonTitle = (Role: RoleEnum) => computed(() => {
  if (isDisabled.value) {
    return 'Vous ne pouvez pas changer le rôle de l\'utilisteur'
  }
  return Role === RoleEnum.OWNER ? 'Changer le rôle pour Utilisateur' : 'Changer le rôle pour Propriétaire'
})

function selectAll(event: any) {
  if (event.target?.checked) {
    selectedPeople.value = usersSorted.value
      .filter(user => !isUserAdmin(user))
      .map(p => p.id)
  }
  selectedPeople.value = []
}

function createNewUser() {
  setUiModal({
    modalName: ModalNameEnum.CREATE_USER,
    modalMode: ModalModeEnum.CREATE,
    isActive: true,
    data: {},
  })
}
</script>
