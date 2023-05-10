<template>
<section class="py-8 bg-white dark:bg-blue-dark_bold DarkModeAnimation">
  <div class="container max-w-5xl m-8 mx-auto">
    <h2
      class="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800 dark:text-white"
    >
      <span class="text-red-light">Be right</span>, comment ça marche ?
    </h2>
    <div class="w-full mb-4 dark:hidden">
      <div class="w-64 h-1 py-0 mx-auto my-0 rounded-t opacity-25 gradient bg-red dark:bg-blue" />
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div class="p-4 md:p-0">
        <div class="hidden md:block">
          <nuxt-img
            class="w-24"
            src="/static/step1.svg"
            alt="étape 1"
            height="100px"
            width="100px"
            sizes="xs:200px md:500px lg:1024"
          />
        </div>

        <div class>
          <h3
            class="text-3xl font-bold leading-none text-gray-800 dark:text-gray-100"
          >
            Sélectionnez un client.
          </h3>
          <p class="text-left text-gray-600 dark:text-gray-50">
            Vous pouvez choisir un client déjà existant ou en ajouter de nouveaux.
            Vous pouvez directement entrer les coordonnées de la personne avec qui vous collaborez.
          </p>
        </div>
      </div>
      <div />
      <div />

      <div class="p-4 md:p-0">
        <div class="hidden md:block">
          <nuxt-img
            class="w-24"
            src="/static/step2.svg"
            alt="étape 2"
            height="100px"
            width="100px"
            sizes="xs:200px md:500px lg:1024"
          />
        </div>
        <div class>
          <div class="p-2 align-middle">
            <h3
              class="text-3xl font-bold leading-none text-gray-800 dark:text-gray-100"
            >
              Créez votre événement
            </h3>
            <p
              class="text-left text-gray-600 dark:text-gray-50"
            >
              Créer l'événement qui aura lieu avec le client. Vous renseignez la date de l'événement, le lieu, pour une parfaite organisation.
            </p>
          </div>
        </div>
      </div>

      <div class="p-4 md:p-0">
        <div class="hidden md:block">
          <nuxt-img
            class="w-24"
            src="/static/step3.svg"
            alt="étape 3"
            height="100px"
            width="100px"
            sizes="xs:200px md:500px lg:1024"
          />
        </div>
        <div class>
          <div class="align-middle">
            <h3
              class="text-3xl font-bold leading-none text-gray-800 dark:text-gray-100"
            >
              Partage de l'accès au client
            </h3>
            <p class="text-left text-gray-600 dark:text-gray-50">
              Votre client a accès aux événements que vous avez en commun.
              Il peut donc renseigner la liste des destinataires des signatures, relancer les destinataires qui n'auraient pas répondu et télécharger l'ensemble des documents qui le concerne.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
</template>
