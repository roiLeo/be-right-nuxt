<template>
<BaseModal
  :is-active="isActive"
  @close="close"
>
  <div class="px-4 py-2 sm:flex sm:items-start">
    <div
      class="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-blue-100 rounded-full sm:mx-0 sm:h-10 sm:w-10"
    >
      <ArrowDownTrayIconOutline
        class="w-6 h-6 text-blue-600"
        aria-hidden="true"
      />
    </div>
    <div class="mt-3 space-y-2 text-center sm:mt-0 sm:ml-4 sm:text-left">
      <DialogTitle
        as="h3"
        class="text-lg font-medium leading-6 text-gray-900"
      >
        Télécharger Le droit à l'image de {{ getEmployeeFullname(employee) }}
      </DialogTitle>
      <div class="mt-2 space-y-4">
        <div class="mt-5 sm:space-x-8 sm:mt-4 sm:flex sm:items-center sm:justify-center">
          <BaseButton
            @click="download"
          >
            Télécharger
          </BaseButton>
          <BaseButton @click="close">
            Annuler
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</BaseModal>
</template>

<script setup lang="ts">
import { useUiStore } from '~~/store'
import type { EmployeeType } from '~~/types'

interface Props {
  employee: EmployeeType
  isActive: boolean
  answerId: number
  refHtml: HTMLElement
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
})

const { getEmployeeFullname } = employeeHook()
const { downloadAnswer } = answerHook()
const { resetUiModalState } = useUiStore()

function close() {
  const router = useRouter()
  router.go(-1)
}

async function download() {
  const { answerId, employee, refHtml } = props

  await downloadAnswer({
    answerId,
    employee,
    templateRef: refHtml,
  })
  resetUiModalState()
  close()
}
</script>
