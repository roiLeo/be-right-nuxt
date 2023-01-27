<template>
<div class="flex justify-center min-h-screen">
  <div class="space-y-8 mt-14">
    <LogoSimpleLogo />
    <p>Cette page n'existe pas</p>
    <div class="flex items-center justify-center space-x-4">
      <BaseButton
        @click="goBack"
      >
        Retour
      </BaseButton>
      <BaseButton
        :href="{ name: 'index' }"
        color="red"
      >
        Accueil
      </BaseButton>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
const router = useRouter()

function goBack() {
  router.back()
}
</script>
