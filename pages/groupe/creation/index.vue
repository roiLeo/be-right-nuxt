<template>
<PageAuthWrapper>
  <div class="flex justify-center">
    <GroupForm />
  </div>
</PageAuthWrapper>
</template>

<script setup lang="ts">
import { RouteNames } from '~/helpers/routes'
import GroupForm from '~~/components/Group/GroupForm.vue'

const { fetchUserGroupsAndRelations } = groupHook()
const { $modal, $router } = useNuxtApp()

onMounted(async () => {
  $modal.show({
    title: 'Choisissez la méthode de création de liste diffusion',
    body: 'Vous pouvez sélectionner les destinataires parmis votre liste. Ou encore créer un groupe à partir d\'un fichier CSV',
    primary: {
      label: 'CSV',
      theme: 'blue',
      action: () => {
        $router.push({
          name: RouteNames.GROUP_CREATE_CSV,
        })
      },
    },
    secondary: {
      label: 'Sélectionner destinataires',
      theme: 'indigo',
      action: () => {},
    },
  })

  await fetchUserGroupsAndRelations()
})

definePageMeta({
  layout: 'auth',
  isAuth: true,
  middleware: 'guards-middleware',
})
</script>
