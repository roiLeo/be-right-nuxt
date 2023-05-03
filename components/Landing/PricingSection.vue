<template>
<section
  id="Pricings"
  class="py-8 DarkModeAnimation"
>
  <div class="container px-2 pt-4 pb-12 mx-auto text-gray-800">
    <h2
      class="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800 dark:text-gray-50"
    >
      Choisissez votre
      <span class="text-red-light">Abonnement</span>
    </h2>
    <div class="w-full mb-4">
      <div class="w-64 h-1 py-0 mx-auto my-0 rounded-t opacity-25 gradient" />
    </div>

    <div class="grid grid-cols-1 mt-10 lg:grid-cols-3 md:gap-2">
      <LandingPricingCard
        title="Essentiel"
        :nb-free-month="1"
        :price="3.99"
      >
        <template #details>
          <span
            class="text-xs"
          >Vous avez une activité soutenue, vous êtes seul ou avec une équipe restreinte.</span>

          <ul class="w-full text-sm">
            <li class="py-4">
              1 utilisateur
            </li>
            <li class="py-4">
              5 évenements
              <span class="text-base">/mois</span>
            </li>
          </ul>
        </template>
      </LandingPricingCard>
      <LandingPricingCard
        title="Pro"
        :nb-free-month="2"
        :price="9.99"
        is-dark
      >
        <template #details>
          <span
            class="text-xs"
          >Vous avez une activité soutenue, vous êtes seul ou avec une équipe restreinte.</span>
          <div class="w-full h-1 py-0 my-0 rounded-t gradient" />
          <ul class="w-full text-base font-bold">
            <li class="py-4">
              3 utilisateurs
            </li>
            <li class="py-4">
              25 événements
              <span class="text-base">/mois</span>
            </li>
          </ul>
        </template>
      </LandingPricingCard>
      <LandingPricingCard
        title="Expert"
        :nb-free-month="3"
        :price="19.99"
      >
        <template #details>
          <span
            class="text-xs"
          >Vous avez une activité soutenue, vous êtes seul ou avec une équipe restreinte.</span>

          <ul class="w-full text-sm">
            <li class="py-4">
              Utilisateurs ilimités
            </li>
            <li class="py-4">
              Événements ilimités
              <span class="text-base">/mois</span>
            </li>
          </ul>
        </template>
      </LandingPricingCard>
    </div>
  </div>
</section>
</template>
