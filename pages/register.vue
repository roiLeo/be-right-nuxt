<template>
<Form
  v-slot="{ meta, isSubmitting }"
  :validation-schema="schema"
  :initial-values="initialValues"
  class="container mx-auto md:grid md:gap-12 md:mt-16 md:grid-cols-2"
  @submit="submitregister"
>
  <div class="flex flex-col mx-auto space-y-12 md:max-w-1/2">
    <div class="mt-4 md:mt-0">
      <h1 class="text-3xl font-bold leading-tight text-center text-gray-800 md:text-5xl md:text-left dark:text-white">
        Inscription
      </h1>
    </div>

    <div class="px-4 space-y-4 text-left md:space-y-0 md:px-0 md:grid md:gap-6 md:grid-cols-2">
      <BaseRadio
        :id="RoleEnum.PHOTOGRAPHER"
        :value="RoleEnum.PHOTOGRAPHER"
        name="roles"
      >
        je suis un photographe
      </BaseRadio>
      <BaseRadio
        :id="RoleEnum.OWNER"
        :value="RoleEnum.OWNER"
        name="roles"
      >
        je suis une enteprise ou un particulier
      </BaseRadio>

      <div class="space-y-4 md:col-span-2">
        <BaseInput
          label="Nom de l'entreprise"
          name="companyName"
          type="text"
          autocomplete="companyName"
          is-required
        />
      </div>

      <div class="space-y-4">
        <BaseInput
          label="Prénom"
          name="firstName"
          type="text"
          autocomplete="firstName"
          is-required
        />
      </div>

      <div class="space-y-4">
        <BaseInput
          label="Nom"
          name="lastName"
          type="text"
          autocomplete="lastName"
          is-required
        />
      </div>

      <div class="col-span-2 space-y-4">
        <BaseInput
          class="md:col-span-2"
          label="Adresse email"
          name="email"
          type="email"
          autocomplete="email"
          is-required
        />
        <BaseInput
          label="Mot de passe"
          name="password"
          type="password"
          autocomplete="current-password"
          is-required
        />
      </div>

      <div class="flex flex-col items-center justify-center space-y-4 md:col-span-2">
        <BaseButton
          :disabled="!meta.valid || !meta.dirty || isSubmitting"
          :is-loading="uiStore.getUIIsLoading || isSubmitting"
          type="submit"
        >
          S'inscrire
        </BaseButton>

        <NuxtLink
          id="already-account-link"
          class="LinkClass"
          :to="{ name: 'login' }"
        >
          J'ai déjà un compte
        </NuxtLink>
      </div>
    </div>
  </div>

  <img
    v-if="$isTouch || $isDesktop"
    class="hidden object-cover max-w-5xl shadow-2xl lg:w-2/3 md:max-w-full md:block TranslateUpAnimation cursor-none"
    src="https://images.unsplash.com/photo-1492146433370-dea32142adc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    width="1577"
    height="1920"
    sizes="xs:200px md:500px lg:1024"
    alt="Objectif d'appareil photo"
  >
  <!-- <nuxt-img
    v-if="$isTouch || $isDesktop"
    class="hidden object-cover max-w-5xl shadow-2xl lg:w-2/3 md:max-w-full md:block TranslateUpAnimation cursor-none"
    src="https://images.unsplash.com/photo-1492146433370-dea32142adc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    width="1577"
    height="1920"
    sizes="xs:200px md:500px lg:1024"
    alt="Objectif d'appareil photo"
  /> -->
</Form>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate'
import { object, string } from 'yup'
import type { UserType, VeeValidateValues } from '@/types'
import { RoleEnum } from '@/types'
import type { Company } from '~~/store'
import { useAuthStore, useUiStore } from '~~/store'
import { passwordRegex } from '~/helpers/regex'

const { $toast, $api } = useNuxtApp()
const router = useRouter()
const { checkMailIsAlreadyExist, jwtDecode } = authHook()
const { storeUsersEntities, getUserfullName } = userHook()
const { storeCompanyEntities } = companyHook()
const { setJWTasUser } = useAuthStore()
const uiStore = useUiStore()
const { IncLoading, DecLoading } = uiStore

const schema = object({
  companyName: string().required('Nom de l\'entreprise est requis').label('Nom de l\'entreprise'),
  email: string().email('vous devez entrer in email valide').required('L\'adresse email est requise'),
  password: string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caratères')
    .required('Le mot de passe est requis')
    .matches(
      passwordRegex,
      'Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial',
    ),
  firstName: string().required('Le prénom est requis').label('Prénom'),
  lastName: string().required('le nom est requis').label('Nom'),
  roles: string().oneOf([RoleEnum.PHOTOGRAPHER, RoleEnum.OWNER]),
})

const initialValues = {
  email: '',
  companyName: '',
  password: '',
  firstName: '',
  lastName: '',
  roles: RoleEnum.OWNER,
}

async function submitregister(form: VeeValidateValues) {
  IncLoading()
  const cookieToken = useCookie('userToken')

  const isEmailExist = await checkMailIsAlreadyExist(form.email)

  if (isEmailExist && !isEmailExist.success) {
    $toast.danger(isEmailExist.message)
  } else {
    const { data } = await $api().post<{ user: UserType; company: Company }>('auth/signup', form)

    if (data) {
      const { user, company } = data

      if (company) {
        storeCompanyEntities(company)
      }

      if (user) {
        storeUsersEntities(user, false)
        cookieToken.value = user.token
        const decode = jwtDecode(ref(user.token))
        $api().setCredentials(user.token)

        if (decode.value) {
          setJWTasUser(decode.value)
        }
        $toast.success(`Heureux de vous revoir ${getUserfullName(user)}`)
        router.replace({
          name: 'evenement',
        })
      }
    }
  }
  DecLoading()
}

useHead({
  title: 'S\'inscrire',
  meta: [
    { name: 'description', content: 'Inscrivez vous pour gérer vos droits à l\'image' },
    { property: 'og:title', content: 'Inscription' },
    { property: 'og:description', content: 'Inscrivez vous pour gérer vos droits à l\'image' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://be-right.co/register' },
    { property: 'og:locale', content: 'fr_FR' },
  ],
})
</script>
