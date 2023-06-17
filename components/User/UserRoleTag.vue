<template>
<div class="relative flex mt-px sm:col-start-3">
  <div :class="`flex flex-col p-2 overflow-y-auto text-xs leading-5 rounded-lg group inset-1 bg-${getRoleColor()}-50 hover:bg-${getRoleColor()}-100`">
    <p :class="`text-${getRoleColor()}-500 group-hover:text-${getRoleColor()}-700 font-semibold`">
      {{ getRoleTranslation(role) }}
    </p>
  </div>
</div>
</template>

<script setup lang="ts">
import { RoleEnum } from '@/types'

interface Props {
  role: RoleEnum
}

const props = defineProps<Props>()

const { getRoleTranslation } = userHook()

function getRoleColor() {
  switch (props.role) {
    case RoleEnum.ADMIN:
      return 'red'
    case RoleEnum.USER:
      return 'lime'
    case RoleEnum.EMPLOYEE:
      return 'gray'
    case RoleEnum.SUPER_USER:
      return 'green'
    case RoleEnum.OWNER:
      return 'sky'
    case RoleEnum.PHOTOGRAPHER:
      return 'purple'

    default:
      return 'gray'
  }
}
</script>
