<template>
<tr>
  <td class="py-4 text-sm font-medium text-gray-900 truncate whitespace-nowrap sm:pl-6">
    {{ group.id }}
  </td>
  <td class="py-4 pl-4 text-sm font-medium text-gray-900 truncate whitespace-nowrap">
    {{ group.name }}
  </td>
  <td class="relative flex flex-col py-4 pl-3 pr-4 space-y-2 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
    <div class="flex justify-end space-x-2">
      <BaseButton
        :disabled="uiStore.getUIIsLoading"
        :href="{
          name: 'groupe-show-id',
          params: {
            id: group.id,
          },
        }"
      >
        <template #icon>
          <EyeIconOutline />
        </template>
        Voir le group
      </BaseButton>
      <BaseButton
        :disabled="uiStore.getUIIsLoading"
        color="red"
        @click="removeRecipients([employeeId], group.id)"
      >
        <template #icon>
          <MinusCircleIconOutline />
        </template>
        <span>Retirer du groupe</span>
      </BaseButton>
    </div>
  </td>
</tr>
</template>

<script setup lang="ts">
import BaseButton from '~/components/Base/BaseButton.vue'
import type { Group } from '~~/store'
import { useUiStore } from '~~/store'

interface Props {
  group: Group
  employeeId: number
}

defineProps<Props>()

const uiStore = useUiStore()
const { removeRecipients } = groupHook()
</script>
