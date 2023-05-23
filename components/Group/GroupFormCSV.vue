<template>
<Form
  v-slot="{ meta, isSubmitting, errors }"
  :validation-schema="validationSchema"
  :initial-values="initialValues"
  class="grid w-full max-w-xl grid-cols-1 gap-6 mt-4 md:grid-cols-2"
  @submit="submit"
>
  <BaseInput
    wrapper-classes="md:col-span-2"
    label="Nom du groupe"
    name="name"
    autocomplete="name"
    is-required
  />

  <BaseTextarea
    class="md:col-span-2"
    label="Description du groupe"
    name="description"
    autocomplete="description"
  />

  <div class="w-full mx-auto space-y-4 md:col-span-2">
    <RadioGroup v-model="method">
      <RadioGroupLabel class="block mb-4 text-sm font-bold text-blue dark:text-gray-100">
        Colonnes personnalisées
      </RadioGroupLabel>
      <div class="grid grid-cols-2 gap-2">
        <GroupFormRadioOption
          title="Colonnes prédéfinies"
          description="L'intitulé des colonnes doit correspondre à 'firstName', 'lastName', 'addressLine', 'postalCode', 'city', 'country', 'email', 'phone'"
          value="auto"
        />
        <GroupFormRadioOption
          title="Importer une liste"
          description="Vous pouvez importer des destinataires à partir un fichier CSV"
          value="custom"
        />
      </div>
    </RadioGroup>
  </div>

  <div
    v-if="method === 'custom'"
    class="space-y-4 md:col-span-2"
  >
    <BaseMessage type="warning">
      <div>
        <p>Vous devez écrire le nom des colonnes comme suit</p>
        <p class="text-sm">
          ex:&nbsp;Prénom, Nom, code postal, rue, ville, pays, email, mobile
        </p>
      </div>
    </BaseMessage>

    <BaseInput
      label="Intitulé des colonnes"
      name="colums"
      is-required
    />
  </div>

  <BaseInputFileButton
    name="file"
    class="md:col-span-2"
  />

  <BaseFormDebug
    v-if="isDebug"
    class="md:col-span-2"
    :errors="errors"
    :meta="meta"
  />

  <div class="flex items-center justify-center mt-6 md:col-span-2">
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
import { Form } from 'vee-validate'
import { array, object, string } from 'yup'
import BaseInput from '../Base/BaseInput.vue'
import BaseMessage from '../Base/BaseMessage.vue'
import { useUiStore, useUserStore } from '~~/store'
import type { VeeValidateValues } from '~~/types'
import GroupFormRadioOption from '~~/components/Group/Form/RadioOption.vue'

interface Props {
  isDebug?: boolean
}

defineProps<Props>()

const uiStore = useUiStore()

const { postOneCSV } = groupHook()
const { fetchOne } = companyHook()
const userStore = useUserStore()

const method = ref<'auto' | 'custom'>('auto')

const validationSchema = computed(() => {
  if (method.value === 'auto') {
    return object({
      name: string().required('le nom de l\'événement est obligatoire'),
      description: string().nullable(),
      file: string().required('Le fichier CSV est requis'),
    })
  }
  if (method.value === 'custom') {
    return object({
      name: string().required('le nom de l\'événement est obligatoire'),
      description: string().nullable(),
      file: string().required('Le fichier CSV est requis'),
      colums: array().of(string())
        .min(5, 'Veuillez écrir le nom de chaque colonnes')
        .max(5, 'Veuillez écrir le nom de chaque colonnes')
        .required('Les noms des colonnes sont obligatoire'),
    })
  }
})

const initialValues = {
  name: null,
  description: null,
  employeeIds: [],
  file: null,
  colums: 'Prénom, Nom, code postal, rue, ville, pays, email, mobile',
}

async function submit(form: VeeValidateValues) {
  const router = useRouter()

  const formData = new FormData()
  formData.set('file', form.file, 'file')
  formData.set('name', form.name)
  formData.set('description', form.description)
  await postOneCSV(formData)

  if (userStore.getAuthUser?.companyId) {
    await fetchOne(userStore.getAuthUser?.companyId)
  }

  router.push({
    name: 'groupe',
  })
}
</script>
