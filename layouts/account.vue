<template>
<main class="flex min-h-screen bg-white dark:bg-blue-dark">
  <MenuDrawer />

  <div class="w-full lg:ml-64">
    <HeaderDashboard />
    <PageAuthWrapper>
      <div class="pb-10 mx-auto max-w-7xl lg:py-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-12 lg:gap-x-5">
          <AccountMenu />

          <slot />
        </div>
      </div>
    </PageAuthWrapper>
  </div>

  <AccountCreateUserModal
    v-if="uiStore.isModalActive(ModalNameEnum.CREATE_USER)"
    :is-active="uiStore.isModalActive(ModalNameEnum.CREATE_USER)"
  />
</main>
</template>

<script setup lang="ts">
import { ModalNameEnum } from '~~/types'
import { useUiStore } from '~~/store'

const uiStore = useUiStore()
</script>
