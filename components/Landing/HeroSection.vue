<template>
<section class="container relative pt-10 md:mx-auto">
  <div
    class="grid items-center justify-center grid-cols-1 gap-4 md:grid-cols-2 md:flex-row DarkModeAnimation"
  >
    <div class="z-10 flex flex-col items-center justify-center mx-auto sm:text-gray-800">
      <h1
        class="my-4 text-2xl font-bold text-center md:text-left md:text-5xl md:leading-snug dark:text-gray-100"
      >
        Gérez enfin le droit à l'image de vos clients facilement !
      </h1>
      <p
        class="mb-8 text-lg leading-normal text-center md:text-left md:text-2xl dark:text-gray-400"
      >
        Commencez maintenant avec un mois gratuit.
      </p>
      <button
        type="button"
        title="commencer"
        class="hidden px-8 py-4 mx-auto my-6 font-bold text-gray-800 transition duration-300 ease-in-out transform bg-white rounded-full shadow-lg ms:block lg:mx-0 hover:underline focus:outline-none focus:shadow-outline hover:-translate-y-2 hover:scale-105"
        href="#Newsletter"
      >
        Commencez
      </button>
    </div>
    <!-- Right Col -->
    <div class="absolute inset-0 z-0 bg-transparent shadow-xl sm:z-50 sm:rounded-lg md:static">
      <img
        class="z-0 w-full duration-300 ease-in-out transform opacity-40 sm:opacity-100 sm:rounded-lg sm:z-50 sm:hover:-translate-x-1"
        src="/static/photographer.webp"
        alt="photographer"
      >
    </div>
  </div>
</section>
</template>
