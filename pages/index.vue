<template>
<div>
  <LandingHeroSection />
  <LandingSolutionSection />
  <LandingHowItWorksSection />
  <LandingPricingSection />
  <LandingNewsletterSection />
</div>
</template>

<script setup lang="ts">
useHead({
  title: 'Be Right',
  meta: [
    { name: 'description', content: 'Gérez enfin le droit à l\'image de vos clients facilement !' },
    { property: 'og:title', content: 'L\'outile de gestion de droit à \'image' },
    { property: 'og:description', content: 'Gérez enfin le droit à l\'image de vos clients facilement !' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://be-right.co/' },
    { property: 'og:locale', content: 'fr_FR' },
  ],
})
</script>
