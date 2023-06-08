<template>
<Menu
  as="div"
  class="relative inline-block text-left"
>
  <div>
    <MenuButton
      :disabled="disabled"
      :data-cy="`user-${props.user.id}-options-links`"
      class="flex flex-col justify-center w-full px-2 py-1 space-y-1 disabled:cursor-not-allowed"
    >
      <div class="w-1 h-1 md:w-1.3 md:h-1.3 bg-purple-800 rounded-full" />
      <div class="w-1 h-1 md:w-1.3 md:h-1.3 bg-purple-800 rounded-full" />
      <div class="w-1 h-1 md:w-1.3 md:h-1.3 bg-purple-800 rounded-full" />
    </MenuButton>
  </div>

  <transition
    enter-active-class="transition duration-100 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <MenuItems
      class="absolute right-0 z-10 w-56 mt-2 overflow-visible origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
    >
      <MenuItem v-slot="{ active }">
        <NuxtLink
          class="flex items-center w-full px-3 py-3 text-sm rounded-md group"
          :class="[
            active ? 'bg-purple-100 text-purple-800' : 'text-gray-900',
          ]"
          :to="{ name: 'admin-user-show-id', params: { id: props.user.id } }"
          :data-cy="`user-${props.user.id}-show-link`"
        >
          <PencilSquareIconOutline
            class="w-5 h-5 mr-2 text-violet-800"
            aria-hidden="true"
          />
          Voir / Modifier
        </NuxtLink>
      </MenuItem>

      <MenuItem
        v-if="!isDeleted"
        v-slot="{ active }"
      >
        <button
          class="flex items-center w-full px-3 py-3 text-sm rounded-md group"
          :class="[
            active ? 'bg-purple-100 text-purple-800' : 'text-gray-900',
          ]"
          @click="addEmployeeToUser"
        >
          <PlusCircleIconOutline
            class="w-5 h-5 mr-2 text-violet-800"
            aria-hidden="true"
          />
          Ajouter un destinataire
        </button>
      </MenuItem>

      <MenuItem
        v-if="!isDeleted"
        v-slot="{ active }"
      >
        <NuxtLink
          class="flex items-center w-full px-3 py-3 text-sm rounded-md cursor-pointer group"
          :class="[
            active ? 'bg-red-100 text-red-500' : 'text-gray-900',
          ]"
          @click="deleteUser"
        >
          <ArchiveBoxIconOutline
            class="w-5 h-5 mr-2 text-red-500"
            aria-hidden="true"
          />
          Archiver
        </NuxtLink>
      </MenuItem>
    </MenuItems>
  </transition>
</Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import type { UserType } from '@/types'
import { ModalModeEnum, ModalNameEnum } from '@/types'
import { useUiStore } from '~~/store'

interface Props {
  user: UserType
  disabled?: boolean
}

const props = defineProps<Props>()

const uiStore = useUiStore()
const { setUiModal } = uiStore

const isDeleted = computed(() => noNull(props.user.deletedAt) && noUndefined(props.user.deletedAt))

function addEmployeeToUser() {
  setUiModal({
    isActive: true,
    modalName: ModalNameEnum.ADD_EMPLOYEE_USER,
    modalMode: ModalModeEnum.CREATE,
    data: {
      userId: props.user.id,
    },
  })
}

function deleteUser() {
  setUiModal({
    isActive: true,
    modalName: ModalNameEnum.USER_ADMIN,
    modalMode: ModalModeEnum.DELETE,
    data: {
      event: props.user,
    },
  })
}
</script>
