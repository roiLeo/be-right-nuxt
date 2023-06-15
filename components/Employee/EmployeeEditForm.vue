<template>
<div class="w-full h-full px-4 mt-4">
  <Form
    v-slot="{ meta, isSubmitting, errors }"
    :validation-schema="schema"
    :initial-values="initialValues"
    class="grid grid-cols-2 gap-4"
    @submit="submit"
  >
    <BaseInput
      label="Prénom"
      name="firstName"
      type="text"
      autocomplete="firstName"
      is-required
    />

    <BaseInput
      label="Nom"
      name="lastName"
      type="text"
      autocomplete="lastName"
      is-required
    />

    <BaseInput
      class="col-span-2"
      label="Adresse email"
      name="email"
      type="email"
      autocomplete="email"
      is-required
    />

    <BaseInput
      label="Téléphone"
      name="phone"
      type="tel"
      autocomplete="phone"
      is-required
    />

    <div
      v-if="isDebug"
      class="flex flex-col space-y-2 md:col-span-2"
    >
      <p>is Dirty = {{ meta.dirty }}</p>
      <p>is valid = {{ meta.valid }}</p>
      <p
        v-for="error in errors"
        :key="error"
      >
        {{ error }}
      </p>
    </div>

    <div class="flex items-center justify-center mt-6 md:col-span-2">
      <BaseButton
        :disabled="!meta.valid || !meta.dirty || isSubmitting"
        :is-loading="isSubmitting"
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
</template>

<script setup lang="ts">
import type { InferType } from 'yup'
import { object, string } from 'yup'
import { Form } from 'vee-validate'
import BaseButton from '../Base/BaseButton.vue'
import BaseInput from '../Base/BaseInput.vue'
import type { EmployeeType } from '~~/store'
import type { VeeValidateValues } from '~/types/globals'

const props = defineProps<Props>()

interface Props {
  employee: EmployeeType
  isDebug?: boolean
}

const schema = object({
  email: string().email('vous devez entrer in email valide').required('L\'adresse email est requise'),
  firstName: string().required('Le prénom est requis'),
  lastName: string().required('Le nom est requis'),
  phone: string().required('Le numéro de téléphone est requis'),
})

const initialValues = {
  email: props.employee?.email || '',
  firstName: props.employee?.firstName || '',
  lastName: props.employee?.lastName || '',
  phone: props.employee?.phone || '',
}

const {
  patchOne,
} = employeeHook()

interface IForm extends InferType<typeof schema> {}

async function submit(form: VeeValidateValues) {
  const formValues = form as IForm
  const employeeToPost = {
    email: formValues.email,
    firstName: formValues.firstName,
    lastName: formValues.lastName,
    phone: formValues.phone,
  } as EmployeeType

  await patchOne(props.employee.id, { ...employeeToPost })
}
</script>
