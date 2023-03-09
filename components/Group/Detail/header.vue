<template>
<div class="py-8 bg-gray-50">
  <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 xl:flex xl:items-center xl:justify-between">
    <div class="flex-1 min-w-0">
      <nav
        class="flex"
        aria-label="Breadcrumb"
      >
        <ol
          role="list"
          class="flex items-center space-x-4"
        >
          <li class="flex items-center">
            <NuxtLink
              :to="{ name: 'groupe' }"
              class="text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Groupes
            </NuxtLink>
            <ChevronRightIconOutline
              class="flex-shrink-0 w-5 h-5 ml-4 text-gray-400"
              aria-hidden="true"
            />
          </li>
          <li class="flex items-center">
            <NuxtLink
              :to="{
                name: 'groupe-show-id',
                params: {
                  id: group.id,
                },
              }"
              class="text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              {{ group.name }}
            </NuxtLink>
          </li>
        </ol>
      </nav>
      <h1 class="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        {{ group.name }}
      </h1>
      <div class="flex flex-col mt-4 sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-8">
        <div class="flex items-center mt-4 text-sm text-gray-500">
          <CalculatorIconOutline
            class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
            aria-hidden="true"
          />
          {{ nbEmployee }} Destinataires
        </div>
        <div class="flex items-center mt-2 text-sm text-gray-500">
          <CalendarIconOutline
            class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
            aria-hidden="true"
          />
          {{ getDisplayedDate() }}
        </div>
      </div>
    </div>

    <div class="flex mt-5 space-x-4 xl:mt-0 xl:ml-4">
      <BaseButton
        title="Fonctionnalité pas encore disponible"
        disabled
      >
        <template #icon>
          <PencilIconOutline />
        </template>
        Modifier
      </BaseButton>
      <BaseButton
        color="red"
        title="Supprimer la liste"
        :disabled="uiStore.getUIIsLoading"
        @click="openDeleteConfirmModal(group.id)"
      >
        <template #icon>
          <TrashIconOutline />
        </template>
        Supprimer
      </BaseButton>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import type { Group } from '~~/store'
import { useUiStore } from '~~/store'

interface Props {
  group: Group
  nbEmployee: number
}

const props = withDefaults(defineProps<Props>(), {
  nbEmployee: 0,
})

const uiStore = useUiStore()

const { isSameDay, toFormat } = dateHook()
const {
  openDeleteConfirmModal,
} = groupHook()

function getDisplayedDate() {
  const date = toFormat(props.group.updatedAt, 'DD MMMM YYYY')
  return isSameDay(props.group.createdAt, props.group.updatedAt)
    ? `Créé le ${date}`
    : `Dernière mise à jour le ${date}`
}
</script>
