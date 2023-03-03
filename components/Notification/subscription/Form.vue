<!-- eslint-disable vue/prefer-separate-static-class -->
<template>
<div class="w-full max-w-2xl p-2 mx-auto bg-white rounded-2xl">
  <Disclosure
    v-slot="{ open }"
    :default-open="$route.query.notificationSubscriptionOpen !== 'false'"
  >
    <DisclosureButton
      :class="[
        'flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-purple-900 bg-purple-100 rounded-lg',
        'hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75',
      ]"
      @click="toggleDisclosure(open)"
    >
      <span>Abonnez vous à des notifications</span>
      <ChevronUpIconOutline
        v-if="open"
        :class="open ? 'rotate-180 transform' : ''"
        class="w-5 h-5 text-purple-500"
      />
    </DisclosureButton>
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-out"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <DisclosurePanel class="px-4 pt-4 pb-2 text-sm text-gray-500 divide-y rounded-b-lg shadow-lg">
        <div
          v-for="type in NotificationTypeEnumArray"
          :key="type"
          class="py-2"
        >
          <SwitchGroup>
            <div class="flex items-center">
              <Switch
                v-model="initalesSubscription(type).value"
                :disabled="uiStore.isLoading > 0"
                :class="[
                  'relative inline-flex items-center h-6 transition-colors rounded-full w-11',
                  'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                  initalesSubscription(type).value ? 'bg-green-500' : 'bg-gray-200',
                  uiStore.isLoading > 0 ? 'cursor-not-allowed opacity-50' : '',
                ]"
                @click="submit(type)"
              >
                <span
                  :class="[
                    'inline-block w-4 h-4 transition-transform transform bg-white rounded-full',
                    initalesSubscription(type).value ? 'translate-x-6' : 'translate-x-1',
                  ]"
                />
              </Switch>
              <SwitchLabel class="ml-4 text-gray-800">
                {{ getTranslationNotificationType(type)?.label }}
              </SwitchLabel>
            </div>
            <p class="my-1 font-extralight">
              {{ getTranslationNotificationType(type)?.description }}
            </p>
          </SwitchGroup>
        </div>
      </DisclosurePanel>
    </transition>
  </Disclosure>
</div>
</template>

<script setup lang="ts">
import type { NotificationTypeEnum } from '~/store/notification/types'
import { NotificationTypeEnumArray } from '~/store/notification/types'
import { useNotificationsSubscriptionStore, useUiStore } from '~~/store'

const {
  getTranslationNotificationType,
} = notificationHook()

const { subscribe, unsubscribe } = notificationSubscriptionHook()
const notificationSubscriptionStore = useNotificationsSubscriptionStore()
const uiStore = useUiStore()

const initalesSubscription = (type: NotificationTypeEnum) =>
  computed(() => notificationSubscriptionStore.getForCurrentUser.map(sub => sub.type).includes(type))

async function submit(type: NotificationTypeEnum) {
  const userSubscription = notificationSubscriptionStore.getForCurrentUser

  if (userSubscription.map(sub => sub.type)?.includes(type)) {
    const subscription = userSubscription.find(sub => sub.type === type)

    if (subscription) {
      await unsubscribe(subscription.id)
    }
  } else {
    await subscribe(type)
  }
}

function toggleDisclosure(open: boolean) {
  const route = useRoute()
  const router = useRouter()

  const queries: any = {}

  if (open) {
    queries.notificationSubscriptionOpen = false
  }

  router.replace({
    name: route.name || 'notifications',
    query: {
      ...queries,
    },
  })
}
</script>
