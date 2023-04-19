<template>
<div class="h-full bg-gray-50">
  <div
    v-if="!uiStore.getUIIsLoading && haveData"
    class="max-w-2xl py-6 mx-auto lg:py-12 sm:px-6 lg:max-w-7xl lg:px-8"
  >
    <div class="px-4 space-y-2 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
      <div class="flex sm:items-baseline sm:space-x-4">
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Confirmation #54879
        </h1>
        <a
          href="#"
          class="hidden text-sm font-medium text-indigo-600 hover:text-indigo-500 sm:block"
        >
          View invoice
          <span aria-hidden="true"> &rarr;</span>
        </a>
      </div>
      <p class="text-sm text-gray-600">
        Créé le <time
          datetime="2021-03-22"
          class="font-medium text-gray-900"
        >{{ $toFormat(event.createdAt, 'DD MMMM YYYY') }}</time>
      </p>
      <a
        href="#"
        class="text-sm font-medium text-indigo-600 hover:text-indigo-500 sm:hidden"
      >
        View invoice
        <span aria-hidden="true"> &rarr;</span>
      </a>
    </div>

    <!-- Products -->
    <div class="mt-6">
      <div class="space-y-8">
        <div class="bg-white border-t border-b border-gray-200 shadow-sm sm:rounded-lg sm:border">
          <div class="px-4 py-6 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:p-8">
            <div class="sm:flex lg:col-span-7">
              <div class="flex-shrink-0 w-full overflow-hidden rounded-lg aspect-w-1 aspect-h-1 sm:aspect-none sm:h-40 sm:w-40">
                <img
                  src="https://images.unsplash.com/photo-1565849904461-04a58ad377e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1036&q=80"
                  alt="Couverture"
                  class="object-cover object-center w-full h-full sm:h-full sm:w-full"
                >
              </div>

              <div class="mt-6 sm:mt-0 sm:ml-6">
                <h3 class="text-base font-medium text-gray-900">
                  <NuxtLink :to="{ name: RouteNames.SHOW_EVENT_ID, params: { id: event.id } }">
                    {{ event.name }}
                  </NuxtLink>
                </h3>
                <p class="mt-2 text-sm font-medium text-gray-900">
                  {{ bill.amount }} €
                </p>
                <p class="mt-3 overflow-y-hidden text-sm text-gray-500 max-h-20">
                  {{ event.description }}
                </p>
              </div>
            </div>

            <div class="mt-6 lg:col-span-5 lg:mt-0">
              <dl class="grid grid-cols-2 text-sm gap-x-6">
                <div v-if="address">
                  <dt class="font-medium text-gray-900">
                    Billing address
                  </dt>
                  <dd class="mt-3 text-gray-500">
                    <span class="block">{{ address.addressLine }}</span>
                    <span class="block">{{ address.postalCode }}</span>
                    <span class="block">{{ address.city }}</span>
                  </dd>
                </div>
                <div>
                  <dt class="font-medium text-gray-900">
                    Shipping updates
                  </dt>
                  <dd class="mt-3 space-y-3 text-gray-500">
                    <p>{{ user?.email }}</p>
                    <button
                      type="button"
                      class="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Edit
                    </button>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div class="px-4 py-6 border-t border-gray-200 sm:px-6 lg:p-8">
            <h4 class="sr-only">
              Status
            </h4>
            <div class="flex items-center space-x-2">
              <EventStatusTag :status="event.status" />
              <p class="text-sm font-medium text-gray-900">
                le <time :datetime="event.createdAt.toString()">{{ $toFormat(event.createdAt, 'DD MMMM YYYY') }}</time>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Billing -->
    <div class="mt-16">
      <h2 class="sr-only">
        Billing Summary
      </h2>

      <div class="px-4 py-6 bg-gray-100 sm:rounded-lg sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-8">
        <dl class="grid grid-cols-2 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:col-span-7">
          <div v-if="address">
            <dt class="font-medium text-gray-900">
              Billing address
            </dt>
            <dd class="mt-3 text-gray-500">
              <span class="block">{{ address.addressLine }}</span>
              <span class="block">{{ address.postalCode }}</span>
              <span class="block">{{ address.city }}</span>
            </dd>
          </div>
          <div>
            <dt class="font-medium text-gray-900">
              Payment security
            </dt>
            <dd class="flex items-center mt-1">
              <a
                class="px-4 py-2 text-white bg-indigo-600 rounded-md text-bold"
                href="https://stripe.com/fr"
                target="_blank"
              >Stripe</a>
            </dd>
          </div>
        </dl>

        <dl class="mt-8 text-sm divide-y divide-gray-200 lg:col-span-5 lg:mt-0">
          <div class="flex items-center justify-between pb-4">
            <dt class="text-gray-600">
              Nombre de destinataires
            </dt>
            <dd class="font-medium text-gray-900">
              {{ answers.length }}
            </dd>
          </div>
          <div class="flex items-center justify-between py-4">
            <dt class="text-gray-600">
              Prix par destinataire
            </dt>
            <dd class="font-medium text-gray-900">
              1€
            </dd>
          </div>
          <div class="flex items-center justify-between pt-4">
            <dt class="font-medium text-gray-900">
              Montant total
            </dt>
            <dd class="font-medium text-indigo-600">
              {{ bill.amount }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>

  <BaseLoader v-else />
</div>
</template>

<script setup lang="ts">
import { usePageLeave } from '@vueuse/core'
import EventStatusTag from '~~/components/Event/EventStatusTag.vue'
import BaseLoader from '~~/components/Base/BaseLoader.vue'
import { RouteNames } from '~~/helpers/routes'
import {
  useAddressStore,
  useAnswerStore,
  useCompanyStore,
  useEventStore,
  useUiStore,
  useUserStore,
} from '~~/store'

const isLeft = usePageLeave()
const eventStore = useEventStore()
const answerStore = useAnswerStore()
const companyStore = useCompanyStore()
const addressStore = useAddressStore()
const userStore = useUserStore()
const uiStore = useUiStore()

const event = computed(() => eventStore.getOne(eventStore.getFirstActive))
const user = computed(() => userStore.getAuthUser)
const company = computed(() => companyStore.getOne(event.value?.companyId))

const address = computed(() => addressStore.getOne(event.value?.addressId) || null)
const answers = computed(() => answerStore.getManyByEventId(event.value?.id))

const bill = computed(() => ({
  amount: answers.value?.length * 1,
}))

const haveData = computed(() => event.value
  && user.value
  && company.value
  && answers.value?.length > 0,
)

const { fetchEventWithRelations } = eventHook()

onMounted(async () => {
  if (eventStore.getFirstActive) {
    await fetchEventWithRelations(eventStore.getFirstActive)
  }
})

watch(() => isLeft.value, val => {
  if (val) {
    eventStore.resetActive()
  }
})

definePageMeta({
  layout: 'auth',
  isAuth: true,
  middleware: ['guards-middleware'],
})
</script>
