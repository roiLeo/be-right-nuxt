<template>
<div class="relative isolate">
  <svg
    class="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
    aria-hidden="true"
  >
    <defs>
      <pattern
        id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
        width="200"
        height="200"
        x="50%"
        y="-1"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M.5 200V.5H200"
          fill="none"
        />
      </pattern>
    </defs>
    <svg
      x="50%"
      y="-1"
      class="overflow-visible fill-gray-50"
    >
      <path
        d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
        stroke-width="0"
      />
    </svg>
    <rect
      width="100%"
      height="100%"
      stroke-width="0"
      fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
    />
  </svg>
  <div
    class="absolute top-0 right-0 -ml-24 overflow-hidden left-1/2 -z-10 transform-gpu blur-3xl lg:ml-24 xl:ml-48"
    aria-hidden="true"
  >
    <div
      class="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
      style="clip-path: polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)"
    />
  </div>
  <div class="overflow-hidden">
    <div class="px-6 pt-24 pb-32 mx-auto max-w-7xl sm:pt-60 lg:px-8 lg:pt-32">
      <div class="max-w-2xl mx-auto gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
        <div class="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Merci de votre réponse !
          </h1>
          <p class="relative mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
            Votre réponse a bien été prise en compte
          </p>
          <div class="flex items-center mt-10 gap-x-6">
            <NuxtLink
              :to="{ name: 'index' }"
              class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Terminer
            </NuxtLink>
            <NuxtLink
              :to="{ name: 'index' }"
              class="text-sm font-semibold leading-6 text-gray-900"
            >
              En savoir plus <span aria-hidden="true">→</span>
            </NuxtLink>
          </div>
        </div>
        <div class="flex justify-end gap-8 mt-14 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
          <div class="flex-none pt-32 ml-auto space-y-8 w-44 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
            <div class="relative">
              <img
                class="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                src="https://images.unsplash.com/photo-1516148066593-477d571e507f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                width="687"
                height="1031"
                sizes="xs:200px md:500px lg:1024"
                alt="Objectif d'appareil photo"
              >
              <!-- <nuxt-img
                class="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                src="https://images.unsplash.com/photo-1516148066593-477d571e507f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                width="687"
                height="1031"
                sizes="xs:200px md:500px lg:1024"
                alt="Objectif d'appareil photo"
              /> -->
              <div class="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-gray-900/10" />
            </div>
          </div>
          <div class="flex-none mr-auto space-y-8 w-44 sm:mr-0 sm:pt-52 lg:pt-36">
            <AnswerThankYouImage src="https://images.unsplash.com/photo-1526089571952-1b2803457035?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80" />
            <AnswerThankYouImage src="https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" />
          </div>
          <div class="flex-none pt-32 space-y-8 w-44 sm:pt-0">
            <AnswerThankYouImage src="https://images.unsplash.com/photo-1615075650468-4e8e293d4989?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" />
            <AnswerThankYouImage src="https://images.unsplash.com/photo-1510773319446-f967bfbffb72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" />
            <AnswerThankYouImage src="https://images.unsplash.com/photo-1549981832-2ba2ee913334?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import AnswerThankYouImage from '~/components/Answer/ThankYou/Image.vue'

useHead({
  title: 'Merci pour votre réponse',
  meta: [
    { name: 'description', content: 'Vous venez de signer votre droit à l\'image en toute sécurité' },
  ],
})

definePageMeta({
  layout: 'employee',
})
</script>
