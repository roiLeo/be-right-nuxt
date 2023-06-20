<template>
<PageAuthWrapper>
  <div class="px-8 py-4 md:py-8">
    <template v-if="groupStore.getAllArray?.length > 0">
      <GroupList :groups="groupStore.getAllArray" />
    </template>

    <BaseLoader v-else-if="uiStore.getUIIsLoading" />

    <BaseMessage
      v-else
      class="max-w-md"
    >
      <div class="max-w-md space-y-2">
        <p>Vous n'avez créé aucun groupe</p>

        <BaseButton :href="{ name: 'groupe-creation' }">
          <template #icon>
            <PlusIconOutline />
          </template>
          Créer un groupe
        </BaseButton>
      </div>
    </BaseMessage>
  </div>
</PageAuthWrapper>
</template>

<script setup lang="ts">
import PageAuthWrapper from '~/components/Page/PageAuthWrapper.vue'
import BaseButton from '~/components/Base/BaseButton.vue'
import BaseMessage from '~/components/Base/BaseMessage.vue'
import { useGroupStore, useUiStore } from '~~/store'
import BaseLoader from '~/components/Base/BaseLoader.vue'

const { fetchUserGroupsAndRelations } = groupHook()
const groupStore = useGroupStore()
const uiStore = useUiStore()

onMounted(async () => {
  await fetchUserGroupsAndRelations()
})

definePageMeta({
  layout: 'auth',
  isAuth: true,
  middleware: 'guards-middleware',
})
</script>
