<template>
<Form
  v-slot="{ meta, isSubmitting }"
  :validation-schema="schema"
  :initial-values="initialValues"
  class="grid w-full grid-cols-1 gap-6 mt-4 md:grid-cols-3"
  @submit="submit"
>
  <BaseInput
    label="Adresse"
    name="addressLine"
    autocomplete="addressLine"
    is-required
    wrapper-classes="col-span-3"
  />

  <BaseInput
    label="Complément d'adresse"
    name="addressLine2"
    autocomplete="addressLine"
    wrapper-classes="col-span-3"
  />

  <BaseInput
    label="Code postal"
    name="postalCode"
    autocomplete="postalCode"
    is-required
  />

  <BaseInput
    label="Ville"
    name="city"
    autocomplete="city"
    is-required
  />

  <BaseInput
    label="Pays"
    name="country"
    autocomplete="country"
    is-required
  />
  <div class="flex items-center justify-center mt-6 md:col-span-3">
    <BaseButton
      :disabled="!meta.valid || !meta.dirty"
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
</template>

<script setup lang="ts">
import type { InferType } from 'yup'
import { object, string } from 'yup'
import { Form } from 'vee-validate'
import type { AddressType, VeeValidateValues } from '@/types'
import { useUiStore } from '~~/store'

interface IForm extends InferType<typeof schema> {}

interface Props {
  address?: AddressType | null
}

const props = withDefaults(defineProps<Props>(), {
  address: null,
})

const emit = defineEmits<{
  (e: 'submitted'): void
}>()

const uiStore = useUiStore()
const { IncLoading, DecLoading, resetUiModalState } = uiStore
const { patchOne: patchOneAddress } = addressHook()

const schema = object({
  addressLine: string().required('L\'adresse est requise'),
  addressLine2: string().nullable(),
  postalCode: string().required('Le code postal est requis'),
  city: string().required('La ville est requise'),
  country: string().required('Le pays est requis'),
})

const initialValues = {
  addressLine: props.address?.addressLine || '',
  addressLine2: props.address?.addressLine2 || null,
  postalCode: props.address?.postalCode || '',
  city: props.address?.city || '',
  country: props.address?.country || 'France',
}

async function submit(form: VeeValidateValues) {
  IncLoading()
  const formValues = form as IForm

  if (props.address) {
    await patchOneAddress(props.address.id, {
      addressLine: formValues.addressLine,
      addressLine2: formValues.addressLine2,
      postalCode: formValues.postalCode,
      city: formValues.city,
      country: formValues.country,
    })
  }
  emit('submitted')
  DecLoading()
  resetUiModalState()
}
</script>
