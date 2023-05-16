<template>
<div class="h-full px-4 md:px-8">
  <BaseLoader v-if="uiStore.getUIIsLoading" />

  <div
    v-else-if="state.answer && state.employee && state.event"
    class="my-6 space-y-6 text-base lg:space-y-8 lg:mx-0 lg:max-w-none"
  >
    <h1 class="mt-2 text-3xl font-bold tracking-tight text-center text-gray-900 sm:text-4xl">
      Autorisation exploitation droit à l'image
    </h1>

    <div class="text-wrapper">
      <p>Je soussigné(e) <span class="font-bold">{{ state.employee.firstName }} {{ state.employee.lastName }}</span></p>
      <p>Demeurant à {{ state.employee.address?.addressLine }}, {{ state.employee.address?.postalCode }}, {{ state.employee.address?.city }}, {{ state.employee.address?.country }}</p>
      <p>
        Né(e) le {{ $toFormat(state.employee.bornAt, 'DD/MM/YYYY') }}
      </p>
      <p>Agissant en mon nom personnel.</p>
      <p>Autorise {{ state.event.partner?.firstName }} {{ state.event.partner?.lastName }} à me photographier, le {{ $toFormat(state.event.start, 'DD/MM/YYYY') }} à {{ state.event.company?.address?.city }}</p>
    </div>

    <div class="text-wrapper">
      <p>
        En conséquence de quoi et conformément aux dispositions relatives au droit à l’image, j’autorise <span class="font-bold">{{ state.event.company?.name }}</span> à fixer, reproduire et communiquer au public les photographies prises dans le cadre de la présente.
      </p>
    </div>

    <div class="text-wrapper">
      <p>
        Les photographies pourront être exploitées et utilisées par <span class="font-bold">{{ state.event.company?.name }}</span> sous toute forme et tous supports*, dans le monde entier (en effet, dès lors qu’il y a une publication sur un réseau social, elle est disponible dans le monde entier), pendant une durée de 8 ans (cela vous protège pour éviter que votre image ne soit utilisée indéfiniment), intégralement ou par extraits et notamment :
      </p>
    </div>

    <div class="px-3 md:px-4 lg:px-8 text-wrapper">
      <p class="italic">
        *Nous entendons tout support audiovisuel et par tous moyens inhérents à ce mode de communication, internet (incluant site web, Intranet, Extranet, Blogs, réseaux sociaux), tous vecteurs de réception confondus (smartphones, tablettes, etc.), médias presse, supports de communication interne, supports promotionnels (PLV, ILV, campagnes d'affichage en tous lieux, toutes dimensions et sur tous supports (urbain, aéroports, gares, transports en commun, etc.), droit d'intégration dans une autre œuvre / œuvre multimédia.
      </p>
    </div>

    <div class="text-wrapper">
      <p>Le bénéficiaire de l’autorisation <span class="font-bold">{{ state.event.company?.name }}</span> s’interdit expressément de procéder à une exploitation des photographies susceptibles de porter atteinte à la vie privée ou à la réputation, et d’utiliser les photographies de la présente, dans tout support à caractère pornographique, raciste, xénophobe ou toute autre exploitation préjudiciable. (Ce paragraphe a également pour objectif de vous protéger des utilisations non désirées de votre image)</p>
    </div>

    <div class="text-wrapper">
      <p>
        Je me reconnais (la personne photographiée) être entièrement rempli de mes droits et je ne pourrai prétendre à aucune rémunération pour l’exploitation des droits visés aux présentes.
      </p>
    </div>

    <div class="text-wrapper">
      <p>
        Je garantis (la personne photographiée) que je ne suis pas lié(e) par un contrat exclusif relatif à l’utilisation de mon image ou de mon nom.
      </p>
    </div>

    <div class="text-wrapper">
      <p>
        Pour tout litige né de l’interprétation ou de l’exécution des présentes, il est fait attribution expresse de juridiction aux tribunaux français.
      </p>
    </div>

    <div class="text-wrapper">
      <p>
        Fait à {{ state.employee.address?.city }}, le <span class="underline">{{ $toFormat(new Date(), 'DD/MM/YYYY') }}</span> en deux exemplaires
      </p>
      <div class="flex justify-between mt-2">
        <div>
          <p>Nom et prénom de la personne photographiée :</p>
          <p class="font-bold">
            {{ state.employee.firstName }} {{ state.employee.lastName }}
          </p>
        </div>
        <div v-if="user">
          <p>Nom et prénom du représentant {{ state.event.company?.name }} :</p>
          <p class="font-bold">
            {{ getUserfullName(user) }}
          </p>
        </div>
      </div>
    </div>
    <div class="flex justify-center">
      <BaseButton @click="state.isFormModalActive = true">
        Répondre
      </BaseButton>
    </div>
  </div>

  <BaseMessage
    v-if="state.errorMessages?.length > 0"
    type="danger"
  >
    <div class="space-y-4">
      <p
        v-for="message in state.errorMessages"
        :key="message"
      >
        {{ message }}
      </p>
      <BaseButton :href="{ name: 'index' }">
        Retour
      </BaseButton>
    </div>
  </BaseMessage>

  <BaseModal
    v-if="state.isFormModalActive"
    :is-active="state.isFormModalActive"
    @close="closeFormModal"
  >
    <div class="px-4 py-2 sm:flex sm:items-start">
      <div class="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-blue-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
        <ExclamationTriangleIconOutline
          class="w-6 h-6 text-blue-600"
          aria-hidden="true"
        />
      </div>
      <div class="mt-3 space-y-2 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900"
        >
          Souhaitez vous accepter le droit à l'image?
        </DialogTitle>
        <div class="flex flex-col items-center mt-2 space-y-4">
          <Form
            v-slot="{ meta, values }"
            :validation-schema="schema"
            :initial-values="{ hasSigned: null, reason: null }"
            class="space-y-2"
            @submit="submitAnswer"
          >
            <p class="text-gray-600">
              Acceptez vous l'autorisation d'exploitation de droit à l'image ?
            </p>
            <div class="inline-flex py-4 space-x-4">
              <BaseRadio
                id="hasSigned-true"
                :value="true"
                name="hasSigned"
              >
                J'accepte
              </BaseRadio>
              <BaseRadio
                id="hasSigned-false"
                :value="false"
                name="hasSigned"
              >
                Je refuse
              </BaseRadio>
            </div>

            <BaseTextarea
              v-if="values.hasSigned === false"
              label="Pourquoi ?"
              name="reason"
            />
            <div class="flex justify-center">
              <BaseButton
                type="submit"
                :disabled="!meta.dirty || !meta.valid"
                :is-loading="uiStore.getUIIsLoading"
              >
                {{ values.hasSigned ? 'Accepter' : 'Refuser' }}
              </BaseButton>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </BaseModal>
</div>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate'
import { boolean, object, string } from 'yup'
import BaseButton from '~/components/Base/BaseButton.vue'
import BaseRadio from '~/components/Base/BaseRadio.vue'
import BaseLoader from '~/components/Base/BaseLoader.vue'
import BaseMessage from '~/components/Base/BaseMessage.vue'
import BaseModal from '~/components/Base/BaseModal.vue'
import BaseTextarea from '~/components/Base/BaseTextarea.vue'
import type { AnswerType, EmployeeType, EventType } from '~/store'
import { useAnswerStore, useEmployeeStore, useEventStore, useUiStore } from '~/store'
import type { VeeValidateValues } from '~/types'

const uiStore = useUiStore()
const { IncLoading, DecLoading } = uiStore
const route = useRoute()
const router = useRouter()
const answerStore = useAnswerStore()
const eventStore = useEventStore()
const employeeStore = useEmployeeStore()

const { $modal, $toast } = useNuxtApp()
const { isUserOwner, getUserfullName } = userHook()
const { updateAnswerForEmployee } = answerHook()

interface State {
  errorMessages: string[]
  answer: AnswerType | null
  event: EventType | null
  employee: EmployeeType | null
  isFormModalActive: boolean
}

const state = reactive<State>({
  errorMessages: [],
  answer: null,
  event: null,
  employee: null,
  isFormModalActive: false,
})

const user = computed(() => state.event?.company?.users?.find(user => isUserOwner(user)))

const schema = object({
  hasSigned: boolean().required('Vous devez répondre'),
  reason: string().nullable(),
})

async function submitAnswer(form: VeeValidateValues) {
  const { query } = route
  const params = route.params as Record<string, number>
  const answerId = params.id as number

  if (!query.token || !query.email || !answerId) {
    state.errorMessages.push(' Email ou Identifiant de la réponse manquante veuiller cliquer sur le lien envoyé par email')
    return
  }

  await updateAnswerForEmployee({
    answerId,
    token: query.token as string,
    email: query.email as string,
    hasSigned: form.hasSigned,
    reason: form.reason || undefined,
  })

  closeFormModal()
  router.replace({
    name: 'answer-merci',
  })
}

function closeFormModal() {
  state.isFormModalActive = false
}

onMounted(async () => {
  IncLoading()

  $modal.show({
    type: 'warning',
    title: 'Instructions',
    body: 'Lisez attentivement ce document avant de répondre.',
    primary: {
      label: 'OK! Merci',
      theme: 'blue',
      action: () => $toast.warning('Merci de votre attention'),
    },
  })

  const params = route.params as Record<string, number>
  const answerId = params?.id
  if (answerId) {
    state.answer = answerStore.getOne(answerId)
    state.event = eventStore.getOne(state.answer?.eventId)
    state.employee = employeeStore.getOne(state.answer?.employeeId)
    if (!state.answer || !state.event || !state.employee) {
      state.errorMessages.push('Données manquantes')
    }
  } else {
    state.errorMessages.push('Identifiant manquant')
  }
  DecLoading()
})

useHead({
  title: 'Signer un document',
  meta: [
    { name: 'description', content: 'Vous pouvez signer votre droit à l\'image en toute sécurité' },
  ],
})

definePageMeta({
  layout: 'employee',
})
</script>

<style scoped>
.text-wrapper {
  @apply text-sm md:text-base lg:mx-auto lg:max-w-5xl lg:text-left
}
</style>
