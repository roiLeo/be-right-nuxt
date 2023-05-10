<template>
<Html
  dir="ltr"
  lang="fr"
>
  <Head>
    <SeoKit />
    <SchemaOrgPerson
      name="Be Right"
      image="/static/photographer.webp"
    />
  </Head>

  <Body>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </Body>
</Html>
</template>

<script setup lang="ts">
</script>

<style>
.page-enter-active,.page-leave-active {
    transition: all 0.4s;
}
.page-enter-from,.page-leave-to {
    opacity: 0;  filter: blur(1rem);
}
</style>
