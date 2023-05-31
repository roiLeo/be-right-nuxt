<template>
<BaseModal
  :is-active="isActive"
  @close="close"
>
  <div class="px-4 py-2 sm:flex sm:items-start">
    <div class="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
      <PlusCircleIconOutline
        class="w-6 h-6 text-red-600"
        aria-hidden="true"
      />
    </div>

    <div class="mt-3 space-y-2 text-center sm:mt-0 sm:ml-4 sm:text-left">
      <DialogTitle
        as="h3"
        class="text-lg font-medium leading-6 text-gray-900"
      >
        Ajouter un destinataire {{ event ? `à l\'événement ${event.name}` : '' }}
      </DialogTitle>

      <div class="mt-2 space-y-4">
        <Form
          v-slot="{ meta, isSubmitting }"
          :validation-schema="schema"
          :initial-values="{ employees: [] }"
          class="mt-4 mb-36"
          @submit="submit"
        >
          <EmployeeComboboxSelector
            name="employees"
            :default-values="employeeStore.getAllArray"
            :disabled-values="defaultEmployeeIds"
            value-key="id"
            is-required
          />
          <div class="flex items-center justify-center mt-6 md:col-span-3">
            <BaseButton
              :disabled="!meta.valid"
              :is-loading="uiStore.getUIIsLoading || isSubmitting"
              type="submit"
            >
              <template #icon>
                <ArrowDownOnSquareIconOutline />
              </template>
              Enregistrer
            </BaseButton>
          </div>
        </Form>
      </div>
    </div>
  </div>
</BaseModal>
</template>

<script setup lang="ts">
import { array, number, object } from 'yup'
import type { InferType } from 'yup'
import { Form } from 'vee-validate'
import BaseModal from '../Base/BaseModal.vue'
import BaseButton from '../Base/BaseButton.vue'
import EmployeeComboboxSelector from './EmployeeComboboxSelector.vue'
import { useAnswerStore, useEmployeeStore, useEventStore, useUiStore } from '~~/store'
import type { VeeValidateValues } from '~/types/globals'

interface Props {
  isActive: boolean
  eventId: number
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
})

const eventStore = useEventStore()
const employeeStore = useEmployeeStore()
const answerStore = useAnswerStore()
const uiStore = useUiStore()
const { IncLoading, DecLoading, resetUiModalState } = uiStore
const { postMany } = answerHook()

const defaultEmployeeIds = computed(() => answerStore.getManyByEventId(props.eventId)?.map(answer => answer.id))

const schema = object({
  employees: array().of(number()).min(1, 'Sélectionnez au moins un destinataire')
    .required('Les destinataires sont obligatoire'),
})

const event = computed(() => eventStore.getOne(props.eventId))

function close() {
  resetUiModalState()
}

interface IForm extends InferType<typeof schema> {}

async function submit(form: VeeValidateValues) {
  IncLoading()
  const formValues = form as IForm

  if (props.eventId && formValues.employees?.length > 0) {
    const employeeIds = formValues.employees.filter(id => id) as number[]
    await postMany(props.eventId, employeeIds)
  }

  close()
  DecLoading()
}
</script>
