<template>
<PageAuthWrapper>
  <EventCreationStepper :current-step-index="currentStepIndex" />

  <div
    v-if="!haveUserEmployees"
    class="flex items-center justify-center"
  >
    <BaseMessage type="warning">
      <div class="flex flex-col items-center">
        Attention vous devez créer des destinataires avant de créer un événement
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
    <EventForm
      class="px-4 lg:px-8"
      :mode="ModalModeEnum.CREATE"
    />
  </template>

  <AddressForm
    v-if="isAddressEventCreation"
    class="px-4 lg:px-8"
  />

  <template v-if="isPhotographerCreation">
    <RadioGroup v-model="isPhotographerAlreadyCreated">
      <RadioGroupLabel class="text-base font-medium text-gray-900">
        Le photographe existe déjà ?
      </RadioGroupLabel>

      <div class="grid grid-cols-1 mt-4 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
        <RadioGroupOption
          v-slot="{ checked, active }"
          as="template"
          :value="false"
        >
          <div
            class="relative flex p-4 bg-white border rounded-lg shadow-sm cursor-pointer focus:outline-none"
            :class="[checked ? 'border-transparent' : 'border-gray-300', active ? 'border-indigo-500 ring-2 ring-indigo-500' : '']"
          >
            <span class="flex flex-1">
              <span class="flex flex-col">
                <RadioGroupLabel
                  as="span"
                  class="block text-sm font-medium text-gray-900"
                >
                  Non
                </RadioGroupLabel>
              </span>
            </span>
            <CheckCircleIconOutline
              class="w-5 h-5 text-indigo-600"
              :class="[!checked ? 'invisible' : '']"
              aria-hidden="true"
            />
            <span
              class="absolute rounded-lg pointer-events-none -inset-px"
              :class="[active ? 'border' : 'border-2', checked ? 'border-indigo-500' : 'border-transparent']"
              aria-hidden="true"
            />
          </div>
        </RadioGroupOption>
        <RadioGroupOption
          v-slot="{ checked, active }"
          as="template"
          :value="true"
        >
          <div
            class="relative flex p-4 bg-white border rounded-lg shadow-sm cursor-pointer focus:outline-none"
            :class="[checked ? 'border-transparent' : 'border-gray-300', active ? 'border-indigo-500 ring-2 ring-indigo-500' : '']"
          >
            <span class="flex flex-1">
              <span class="flex flex-col">
                <RadioGroupLabel
                  as="span"
                  class="block text-sm font-medium text-gray-900"
                >
                  Oui
                </RadioGroupLabel>
              </span>
            </span>
            <CheckCircleIconOutline
              class="w-5 h-5 text-indigo-600"
              :class="[!checked ? 'invisible' : '']"
              aria-hidden="true"
            />
            <span
              class="absolute rounded-lg pointer-events-none -inset-px"
              :class="[active ? 'border' : 'border-2', checked ? 'border-indigo-500' : 'border-transparent']"
              aria-hidden="true"
            />
          </div>
        </RadioGroupOption>
      </div>
    </RadioGroup>
    <transition
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="transform opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition ease-in duration-90"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform opacity-0"
    >
      <UserPhotographerForm
        v-if="!isPhotographerAlreadyCreated"
        @submitted="submit"
      />
      <UserPhotographerSelect
        v-else
        @submitted="submit"
      />
    </transition>
  </template>

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
            :class="isSubmitStepComplete(40).value ? 'text-indigo-600' : ''"
          >
            Adresse
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
</PageAuthWrapper>
</template>

<script setup lang="ts">
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'
import type { EventTypeCreate, UserType } from '@/types'
import { ModalModeEnum } from '@/types'
import { isArrayOfNumbers } from '@/utils'
import {
  useAddressStore,
  useAuthStore,
  useEmployeeStore,
  useEventStore,
  useUiStore,
  useUserStore,
} from '~~/store'

const route = useRoute()
const router = useRouter()

const eventStore = useEventStore()
const { resetCreationForm: resetEventForm } = eventStore
const userStore = useUserStore()
const { resetPhotographerForm } = userStore
const addressStore = useAddressStore()
const { resetCreationForm: resetAddressForm } = addressStore
const uiStore = useUiStore()
const { IncLoading, DecLoading } = uiStore
const employeeStore = useEmployeeStore()
const authStore = useAuthStore()

const { postOne: postOneEvent } = eventHook()
const { postMany: postManyAnswers } = answerHook()
const { postPhotographer } = userHook()

const isEventCreation = computed(() => route.query.step === 'event' || route.query.step === undefined)
const isAddressEventCreation = computed(() => route.query.step === 'address')
const isPhotographerCreation = computed(() => route.query.step === 'photographer')
const isEnd = computed(() => route.query.step === 'end')
const isPhotographerAlreadyCreated = ref(true)

const currentStepIndex = computed(() => {
  if (isEventCreation.value) {
    return 0
  }
  if (isAddressEventCreation.value) {
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

async function submit(photographerId?: number | UserType) {
  IncLoading()
  let photographer = null
  if (!isPhotographerAlreadyCreated.value) {
    photographer = await postPhotographer({
      ...userStore.photographerForm,
    })
  } else if (photographerId) {
    photographer = userStore.getOne(photographerId)
  }
  resetPhotographerForm()
  progressBarProgession.value = 20
  if (photographer && eventStore.creationForm.createdByUser) {
    const userId = eventStore.creationForm.createdByUser
    const event = {
      ...eventStore.creationForm,
      createdByUser: userId,
      partner: photographer.id,
    } as unknown as EventTypeCreate
    const newEvent = await postOneEvent(
      {
        event,
        userId,
        address: { ...addressStore.creationForm },
        photographerId: photographer.id,
      })
    progressBarProgession.value = 40
    if (newEvent) {
      if (eventStore.creationForm.employeeIds.length > 0 && isArrayOfNumbers(eventStore.creationForm.employeeIds)) {
        await postManyAnswers(newEvent.id, eventStore.creationForm.employeeIds)
        progressBarProgession.value = 60
      }
      resetEventForm()
      progressBarProgession.value = 100
      resetAddressForm()
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

definePageMeta({
  layout: 'auth',
  isAuth: true,
  middleware: 'guards-middleware',
})
</script>
