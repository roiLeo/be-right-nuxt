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
        Ajouter un destinataire {{ user ? `à l\'utilisateur ${getUserfullName(user)}` : '' }}
      </DialogTitle>

      <div class="mt-2 space-y-4">
        <Form
          v-slot="{ meta, isSubmitting, errors }"
          :validation-schema="schema"
          :initial-values="{ userId, country: 'France' }"
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

          <div class="col-span-2 space-y-2">
            <BaseInput
              label="Adresse"
              name="addressLine"
              autocomplete="addressLine"
              is-required
            />
          </div>

          <div class="col-span-2 space-y-2">
            <BaseInput
              label="Complément d'adresse"
              name="addressLine2"
              autocomplete="addressLine"
            />
          </div>

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
              :is-loading="uiStore.getUIIsLoading || isSubmitting"
              type="submit"
            >
              <template #icon>
                <ArrowDownOnSquareIconOutline />
              </template>
              Créer
            </BaseButton>
          </div>
        </Form>
      </div>
    </div>
  </div>
</BaseModal>
</template>

<script setup lang="ts">
import { number, object, string } from 'yup'
import type { InferType } from 'yup'
import { Form } from 'vee-validate'
import BaseModal from '../Base/BaseModal.vue'
import BaseButton from '../Base/BaseButton.vue'
import BaseInput from '../Base/BaseInput.vue'
import type { AddressType, EmployeeType } from '~~/store'
import { useUiStore, useUserStore } from '~~/store'
import type { VeeValidateValues } from '~/types/globals'

interface Props {
  isActive: boolean
  userId: number
  isDebug?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
})

const userStore = useUserStore()
const uiStore = useUiStore()
const { IncLoading, DecLoading, resetUiModalState } = uiStore
const { getUserfullName } = userHook()
const { postOneAdminForUser } = employeeHook()

const user = computed(() => userStore.getOne(props.userId))
const schema = object({
  email: string().email('vous devez entrer in email valide').required('L\'adresse email est requise'),
  firstName: string().required('Le prénom est requis'),
  lastName: string().required('Le nom est requis'),
  phone: string().required('Le numéro de téléphone est requis'),
  addressLine: string().required('L\'adresse est requise'),
  addressLine2: string().nullable(),
  postalCode: string().required('Le code postal est requis'),
  city: string().required('La ville est requise'),
  country: string().required('Le pays est requis'),
  userId: number().required('L\'identifiant de l\'utilisateur est requis'),
})

function close() {
  resetUiModalState()
}

interface IForm extends InferType<typeof schema> {}

async function submit(form: VeeValidateValues) {
  IncLoading()
  const formValues = form as IForm

  const payload = {
    employee: {
      email: formValues.email,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      phone: formValues.phone,
    },
    address: {
      addressLine: formValues.addressLine,
      addressLine2: formValues.addressLine2,
      postalCode: formValues.postalCode,
      city: formValues.city,
      country: formValues.country,
    },
    userId: formValues.userId,
  } as { employee: EmployeeType; address: AddressType; userId: number }

  await postOneAdminForUser(payload)
  // TODO Refacto this component with employee form
  close()
  DecLoading()
}
</script>
