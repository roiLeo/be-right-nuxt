<template>
<PageAuthWrapper>
  <EventFormStepperWrapper :current-step-index="currentStepIndex" />

  <div
    v-if="!haveUserEmployees"
    class="flex items-center justify-center my-4"
  >
    <BaseMessage type="warning">
      <div class="flex flex-col items-center">
        <p>Attention vous devez créer des destinataires avant de créer un événement</p>
        <BaseButton
          class="mt-4"
          :href="{ name: 'destinataire-create' }"
        >
          Créer un destinataire
        </BaseButton>
      </div>
    </BaseMessage>
  </div>

  <template v-if="isEventCreation">
    <EventFormStep1 class="px-4 lg:px-8" />
  </template>

  <EventFormStep2
    v-if="isEmployeeStepEventCreation"
    class="px-4 lg:px-8"
  />

  <div
    v-if="isPhotographerCreation"
    class="px-4 lg:px-8"
  >
    <PhotographerSelect
      @submitted="submit"
    />
  </div>

  <div
    v-else-if="isEnd"
    class="mt-6 space-y-2"
  >
    <h4 class="text-center">
      Merci d'avoir rempli le formulaire
    </h4>
    <div>
      <h4 class="sr-only">
        Status
      </h4>
      <p class="text-sm font-medium text-gray-900">
        Enregistrement des données...
      </p>
      <div
        class="mt-6"
        aria-hidden="true"
      >
        <div class="overflow-hidden bg-gray-200 rounded-full">
          <div
            class="h-2 bg-indigo-600 rounded-full"
            :style="`width: ${progressBarProgession}%`"
          />
        </div>
        <div class="hidden grid-cols-5 mt-6 text-sm font-medium text-gray-600 sm:grid">
          <div :class="progressBarProgession === 0 ? 'text-indigo-600' : ''">
            L'événement
          </div>
          <div
            class="text-center"
            :class="isSubmitStepComplete(20).value ? 'text-indigo-600' : ''"
          >
            Destinataires
          </div>
          <div
            class="text-center"
            :class="isSubmitStepComplete(60).value ? 'text-indigo-600' : ''"
          >
            Photographe
          </div>
          <div
            class="text-right"
            :class="isSubmitStepComplete(100).value ? 'text-indigo-600' : ''"
          >
            ok
          </div>
        </div>
      </div>
    </div>
    <BaseMessage
      v-if="isSubmitStepComplete(100).value"
      type="success"
    >
      L'événement a bien été créé
    </BaseMessage>
  </div>

  <PhotographerModal
    v-if="uiStore.getUiModalState.isActive
      && uiStore.getUiModalState.modalName === ModalNameEnum.CREATE_PHOTOGRAPHER"
    :is-active="uiStore.getUiModalState.isActive
      && uiStore.getUiModalState.modalName === ModalNameEnum.CREATE_PHOTOGRAPHER"
    @close="resetUiModalState"
    @submitted="submit"
  />
</PageAuthWrapper>
</template>

<script setup lang="ts">
import type { EventTypeCreate } from '@/types'
import {
  useAuthStore,
  useCompanyStore,
  useEmployeeStore,
  useFormStore,
  useUiStore,
  useUserStore,
} from '~~/store'
import PhotographerModal from '~~/components/Photographer/PhotographerModal.vue'
import { ModalNameEnum } from '~~/types'
import type { BaseAddressCreationForm, PhotographerCreatePayload } from '~~/store/form/types'
import { FormEnum } from '~~/store/form/types'

const route = useRoute()
const router = useRouter()

const userStore = useUserStore()
const uiStore = useUiStore()
const { IncLoading, DecLoading, resetUiModalState } = uiStore
const employeeStore = useEmployeeStore()
const authStore = useAuthStore()

const { postOne: postOneEvent } = eventHook()
const { postPhotographer, getPhotographerUserWorkedWith } = userHook()
const { fetchMany } = employeeHook()
const formStore = useFormStore()
const companyStore = useCompanyStore()

const isEventCreation = computed(() => route.query.step === 'evenement' || route.query.step === undefined)
const isEmployeeStepEventCreation = computed(() => route.query.step === 'destinataires')
const isPhotographerCreation = computed(() => route.query.step === 'photographer')
const isEnd = computed(() => route.query.step === 'paiement')

const currentStepIndex = computed(() => {
  if (isEventCreation.value) {
    return 0
  }
  if (isEmployeeStepEventCreation.value) {
    return 1
  }
  if (isPhotographerCreation.value) {
    return 2
  }
  if (isEnd.value) {
    return 3
  }
  return 0
})

const progressBarProgession = ref<number>(0)
const isSubmitStepComplete = (purcent: number) => computed(() => purcent >= progressBarProgession.value)

const haveUserEmployees = computed(() => {
  if (!authStore.isAuthUserAdmin) {
    return employeeStore.getAllArray.length > 0
  }
  return true
})

async function submit() {
  IncLoading()
  let photographer = null

  const {
    isSelectedPhotographerValid,
    isNewPhotographerValid,
    getFormState,
    getPhotographerId,
    resetForm,
  } = formStore

  if (!isSelectedPhotographerValid && isNewPhotographerValid) {
    const payload = getFormState(FormEnum.PHOTOGRAPHER_FORM)
    photographer = await postPhotographer(payload as PhotographerCreatePayload)
  } else if (getPhotographerId) {
    photographer = userStore.getOne(getPhotographerId)
  }

  resetForm(FormEnum.PHOTOGRAPHER_FORM)
  progressBarProgession.value = 20

  if (photographer) {
    const newEvent = await postOneEvent(
      {
        event: getFormState(FormEnum.EVENT_FORM) as unknown as EventTypeCreate,
        address: getFormState(FormEnum.ADDRESS_FORM) as BaseAddressCreationForm,
        photographerId: photographer.id,
      })

    progressBarProgession.value = 40

    if (newEvent) {
      resetForm(FormEnum.EVENT_FORM)
      progressBarProgession.value = 100

      resetForm(FormEnum.ADDRESS_FORM)

      router.push({
        name: 'evenement-show-id',
        params: {
          id: newEvent.id,
        },
      })
    }
  }
  DecLoading()
}

onMounted(async () => {
  IncLoading()
  if (!authStore.isAuthUserAdmin
    && companyStore.getAuthCompany
    && companyStore.getAuthCompany.employeeIds.length > 0) {
    const missingsEmployeeIds = companyStore.getAuthCompany.employeeIds.filter(id => !employeeStore.isAlreadyInStore(id))

    if (missingsEmployeeIds?.length > 0) {
      await fetchMany(missingsEmployeeIds)
    }
    await getPhotographerUserWorkedWith(companyStore.getAuthCompany?.id)
  }
  DecLoading()
})

definePageMeta({
  layout: 'auth',
  isAuth: true,
  middleware: 'guards-middleware',
})
</script>
