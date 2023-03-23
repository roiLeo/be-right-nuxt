<template>
<div class="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
  <ul
    role="list"
    class="divide-y divide-gray-200"
  >
    <li
      v-for="badge in badgeStore.getAllArray"
      :key="badge.id"
    >
      <div
        class="flex items-center px-4 py-4 sm:px-6"
        :class="[userStore.getAuthUserId && badge.userIds.includes(userStore.getAuthUserId) ? 'text-indigo-600' : 'opacity-50 text-gray-400 group-hover:text-gray-600 group-hover:border-gray-500']"
      >
        <div class="flex items-center flex-1 min-w-0">
          <div class="flex-shrink-0">
            <BadgeIcon
              :badge="badge"
            />
          </div>
          <div class="items-center flex-1 min-w-0 px-4 md:grid md:grid-cols-2 md:gap-4">
            <p class="font-medium truncate">
              {{ badge.label }}
            </p>
            <div class="hidden md:block">
              <div>
                <p class="flex items-center text-sm text-gray-500">
                  Vous avez {{ badge.label }}
                </p>
              </div>
            </div>
          </div>
          <CheckIconOutline
            v-if="userStore.getAuthUserId && badge.userIds.includes(userStore.getAuthUserId)"
            class="w-6 h-6 text-green-500"
          />
        </div>
      </div>
    </li>
  </ul>
</div>
</template>

<script setup lang="ts">
import { useBadgeStore, useUserStore } from '~~/store'

const { fetchAll } = badgeHook()
const badgeStore = useBadgeStore()

const userStore = useUserStore()

onMounted(async () => {
  if (badgeStore.getIsEmpty) {
    await fetchAll()
  }
})

definePageMeta({
  layout: 'account',
  isAuth: true,
  middleware: 'guards-middleware',
})
</script>
