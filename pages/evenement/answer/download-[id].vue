<template>
<table
  ref="answerTemplate"
  class="main"
>
  <h1>Autorisation exploitation droit à l'image</h1>

  <div class="text-wrapper">
    <p>Je soussigné(e) <span class="field-bold">{{ employee.firstName }} {{ employee.lastName }}</span></p>
    <p>Demeurant à {{ employeeAddress.addressLine }}, {{ employeeAddress.postalCode }}, {{ employeeAddress.city }}, {{ employeeAddress.country }}</p>
    <p>
      Né(e) le {{ $toFormat(employee.bornAt, 'DD/MM/YYYY') }}
    </p>
    <p>Agissant en mon nom personnel.</p>
    <p>Autorise {{ partner.firstName }} {{ partner.lastName }} à me photographier, le {{ $toFormat(event.start, 'DD/MM/YYYY') }} à {{ userAddress.city }}</p>
  </div>

  <div class="text-wrapper">
    <p>
      En conséquence de quoi et conformément aux dispositions relatives au droit à l’image, j’autorise <span class="field-bold">{{ company.name }}</span> à fixer, reproduire et communiquer au public les photographies prises dans le cadre de la présente.
    </p>
  </div>

  <div class="text-wrapper">
    <p>
      Les photographies pourront être exploitées et utilisées par <span class="field-bold">{{ company.name }}</span> sous toute forme et tous supports*, dans le monde entier (en effet, dès lors qu’il y a une publication sur un réseau social, elle est disponible dans le monde entier), pendant une durée de 8 ans (cela vous protège pour éviter que votre image ne soit utilisée indéfiniment), intégralement ou par extraits et notamment :
    </p>
  </div>

  <div class="text-wrapper quote-wrapper">
    <p class="quote">
      *Nous entendons tout support audiovisuel et par tous moyens inhérents à ce mode de communication, internet (incluant site web, Intranet, Extranet, Blogs, réseaux sociaux), tous vecteurs de réception confondus (smartphones, tablettes, etc.), médias presse, supports de communication interne, supports promotionnels (PLV, ILV, campagnes d'affichage en tous lieux, toutes dimensions et sur tous supports (urbain, aéroports, gares, transports en commun, etc.), droit d'intégration dans une autre œuvre / œuvre multimédia.
    </p>
  </div>

  <div class="text-wrapper">
    <p>Le bénéficiaire de l’autorisation <span class="field-bold">{{ company.name }}</span> s’interdit expressément de procéder à une exploitation des photographies susceptibles de porter atteinte à la vie privée ou à la réputation, et d’utiliser les photographies de la présente, dans tout support à caractère pornographique, raciste, xénophobe ou toute autre exploitation préjudiciable. (Ce paragraphe a également pour objectif de vous protéger des utilisations non désirées de votre image)</p>
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
      Fait à {{ employeeAddress.city }}, le {{ $toFormat(new Date(), 'DD/MM/YYYY') }} en deux exemplaires
    </p>
    <div class="signature-wrapper">
      <div>
        <p>Nom et prénom de la personne photographiée :</p>
        <p class="field-bold">
          {{ employee.firstName }} {{ employee.lastName }}
        </p>
      </div>
      <div>
        <p>Nom et prénom du représentant {{ company.name }} :</p>
        <p class="field-bold">
          {{ user.firstName }} {{ user.lastName }}
        </p>
      </div>
    </div>
  </div>
</table>
</template>

<script setup lang="ts">
import {
  ModalModeEnum,
  ModalNameEnum,
  useAddressStore,
  useAnswerStore,
  useCompanyStore,
  useEmployeeStore,
  useEventStore,
  useUiStore,
  useUserStore,
} from '~~/store'
import { RoleEnum } from '~~/types'

const employeeStore = useEmployeeStore()
const companyStore = useCompanyStore()
const eventStore = useEventStore()
const addressStore = useAddressStore()
const userStore = useUserStore()
const answerStore = useAnswerStore()
const route = useRoute()
const { setUiModal } = useUiStore()

const answerId = route.name === 'evenement-answer-download-id' && parseInt(route.params.id.toString())
const answer = answerStore.getOne(answerId)
const employee = employeeStore.getOne(answer.employeeId)
const event = eventStore.getOne(answer.eventId)
const company = companyStore.getOne(event.companyId)
const user = userStore.getWhere(user => company.userIds.includes(user.id) && user.roles === RoleEnum.OWNER)
const partner = userStore.getOne(event.partnerId)
const userAddress = addressStore.getOne(company.addressId)
const employeeAddress = addressStore.getOne(employee.addressId)

const answerTemplate = ref<null | HTMLElement>(null)

watch(() => answerTemplate.value, () => {
  if (answerTemplate.value) {
    setUiModal({
      modalName: ModalNameEnum.DOWNLOAD_ANSWER,
      modalMode: ModalModeEnum.DOWNLOAD,
      isActive: true,
      data: {
        templateRef: answerTemplate.value,
        employee,
        answerId,
      },
    })
  }
})

definePageMeta({
  layout: 'none',
  isAuth: true,
  middleware: ['guards-middleware', 'answer-download-middleware'],
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Montserrat:300,300i,400,500,700i');
@page {
size: A4;
}

.main {
 padding: 4em 8em;
 margin: 0 2rem;
 margin-right: 20.2rem;
 width: 100%;
 max-height: 3508px;
}

.signature-wrapper {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  max-height: 3508px;
}

h1 {
  font-size:0.5em;
  font-family:roboto, serif;
  font-weight:bold;
  text-align: center;
  font-family: Montserrat, Serif;
}

.text-wrapper {
  margin: 5px 0;
}

.quote-wrapper {
  padding: 0 1rem;
}

.quote {
  font-style: italic;
}

.field-bold {
  font-weight: bold;
}

p {
  font-size:0.2em;
}
</style>
