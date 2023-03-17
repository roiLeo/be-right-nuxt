<template>
<PageAuthWrapper>
  <div class="px-8 py-4 md:py-8">
    <template v-if="groupStore.getAllArray?.length > 0">
      <GroupList :groups="groupStore.getAllArray" />
    </template>
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
import { useGroupStore } from '~~/store'

const { fetchUserGroupsAndRelations } = groupHook()
const groupStore = useGroupStore()

onMounted(async () => {
  await fetchUserGroupsAndRelations()
})

definePageMeta({
  layout: 'auth',
  isAuth: true,
  middleware: 'guards-middleware',
})
</script>
