<template>
<div class="sticky top-0 z-10 flex items-center justify-between flex-shrink-0 w-full h-16 bg-white border-b border-gray-200 dark:border-0 dark:bg-gray-800 drop-shadow">
  <div class="flex items-center ml-2 space-x-4">
    <div class="flex flex-col flex-1">
      <div class="sticky top-0 z-10 pt-1 pl-1 lg:hidden sm:pl-3 sm:pt-3">
        <button
          type="button"
          class="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          data-cy="open-drawer-mobile"
          @click="toggleDrawer"
        >
          <span class="sr-only">Open sidebar</span>
          <Bars3IconOutline
            class="w-6 h-6"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>

    <a
      data-cy="go-back-button"
      class="flex items-center space-x-2 text-gray-500 cursor-pointer dark:text-white-break hover:underline"
      @click="goBack"
    >
      <ChevronLeftIconOutline class="w-5 h-5" />
      <span>Retour</span>
    </a>
    <h3
      v-if="getRouteHeaderContent"
      class="flex items-center space-x-4 font-semibold text-gray-800 text-normal md:text-2xl dark:text-white"
    >
      <component
        :is="getRouteHeaderContent.icon"
        class="h-6 rounded-lg dark:bg-red"
      />
      <span>{{ getRouteHeaderContent.label }}</span>
    </h3>
    <h3
      v-else
      class="flex items-center space-x-4 font-semibold text-gray-800 text-normal md:text-2xl dark:text-white"
    >
      <span>{{ getOutsideMenuRouteLabel }}</span>
    </h3>
  </div>

  <div class="flex items-ceneter">
    <NotificationMenu is-in-header />

    <UserMenu
      is-in-header
      class="lg:hidden"
      data-cy="user-menu-in-header"
    />
  </div>
</div>
</template>

<script setup lang="ts">
import { MENU_ITEMS } from '@/helpers/menu'
import { useUiStore } from '~~/store'

const router = useRouter()
const route = useRoute()
const { toggleDrawer } = useUiStore()

const getRouteHeaderContent = computed(() =>
  MENU_ITEMS.find(item => item.linkName === route.name),
)

const getOutsideMenuRouteLabel = computed(() => {
  if (route.name) {
    const formatedRouteName = route.name.toString().split('.').splice(1).join('.')

    switch (formatedRouteName) {
      case 'evenement-show-id':
        return 'Détail de l\'événement'
      case 'evenement-edit-id':
        return 'Modifier l\'événement'
      case 'evenement-archives':
        return 'Événements supprimés'
      case 'evenement-create':
        return 'Créer un événement'

      case 'groupe-creation':
        return 'Créer un groupe'

      case 'user-show-id':
        return 'Détail de l\'utilisateur'
      case 'user-edit-id':
        return 'Modifier l\'utilisateur'

      case 'destinataire-show-id':
        return 'Détail du destinataire'
      case 'destinataire-create':
        return 'Créer un destinataire'
      case 'destinataire-edit-id':
        return 'Modifier le destinataire'

      case 'mon-compte-notifications':
        return 'Gestion des notifications'
      case 'mon-compte-parametre':
        return 'Gestion des paramètres'
      case 'mon-compte-plan-billing':
        return 'Abonnement et facturation'
      case 'mon-compte-utilisateurs':
        return 'Gestions des comptes utilisateurs'

      case 'addresse-create':
        return 'Ajouter une adresse'
      case 'addresse-edit-id':
        return 'Modifier l\'adresse'
      case 'address-show-id':
        return 'Voir l\'adresse'
    }
  }
})

function goBack() {
  router.back()
}
</script>
