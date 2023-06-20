<template>
<Form
  v-slot="{ meta, isSubmitting }"
  :validation-schema="schema"
  :initial-values="initialValues"
  class="container grid grid-cols-1 gap-12 py-6 mx-auto md:grid-cols-2"
  @submit="submitLogin"
>
  <div class="flex flex-col mx-auto space-y-12 max-w-1/2">
    <div class="space-y-2 mb-26">
      <h1 class="text-center text-black dark:text-white">
        Connectez vous sur
      </h1>
      <LogoSimpleLogo />
    </div>

    <div class="space-y-4">
      <BaseInput
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

    <div class="flex flex-col items-center justify-center space-y-6">
      <BaseButton
        :disabled="!meta.valid || !meta.dirty || isSubmitting"
        :is-loading="uiStore.getUIIsLoading || isSubmitting"
        type="submit"
      >
        Se Connecter
      </BaseButton>
      <NuxtLink
        id="register-link"
        class="LinkClass"
        :to="{ name: 'register' }"
      >
        S'inscrire
      </NuxtLink>
      <NuxtLink
        id="mot-de-passe-oublie-link"
        class="LinkClass"
        :to="{ name: RouteNames.FORGOT_PASSWORD }"
      >
        Mot de passe oublié
      </NuxtLink>
    </div>
  </div>

  <img
    v-if="$isTouch || $isDesktop"
    class="hidden object-cover w-2/3 max-w-5xl shadow-2xl TranslateUpAnimation cursor-none md:block"
    src="https://images.unsplash.com/photo-1492146433370-dea32142adc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    width="1577"
    height="1920"
    sizes="xs:200px md:500px lg:1024"
    alt="Objectif d'appareil photo"
  >
  <!-- <nuxt-img
    v-if="$isTouch || $isDesktop"
    class="hidden object-cover w-2/3 max-w-5xl shadow-2xl TranslateUpAnimation cursor-none md:block"
    src="https://images.unsplash.com/photo-1492146433370-dea32142adc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    width="1577"
    height="1920"
    sizes="xs:200px md:500px lg:1024"
    alt="Objectif d'appareil photo"
  /> -->
</Form>
</template>

<script setup lang="ts">
import { object, string } from 'yup'
import { Form } from 'vee-validate'
import type { UserType, VeeValidateValues, WithoutId } from '@/types'
import type { Company } from '~~/store'
import { useAuthStore, useUiStore } from '~~/store'
import { RouteNames } from '~/helpers/routes'

const uiStore = useUiStore()
const { storeUsersEntities, getUserfullName } = userHook()
const { storeCompanyEntities } = companyHook()
const { jwtDecode, getCookie } = authHook()
const { IncLoading, DecLoading } = uiStore
const authStore = useAuthStore()
const { setJWTasUser, setToken } = authStore
const router = useRouter()

const schema = object({
  email: string().email('vous devez entrer in email valide').required('L\'adresse email est requise'),
  password: string().required('Le mot de passe est requis'),
})

const initialValues = {
  email: '',
  password: '',
}

const { $toast, $api } = useNuxtApp()

async function submitLogin(form: VeeValidateValues) {
  const cookieToken = getCookie()
  IncLoading()
  const { data } = await $api().post<{ user: UserType; company: Company }>('user/login', form as WithoutId<UserType>)
  if (data) {
    const { user, company } = data
    if (user?.token && company) {
      $api().setCredentials(user.token)

      storeCompanyEntities(company)
      storeUsersEntities(user, false)
      cookieToken.value = user.token
      const decode = jwtDecode(ref(user.token))
      setToken(user.token)

      if (decode.value) {
        setJWTasUser(decode.value)
      }
      $toast.success(`Heureux de vous revoir ${getUserfullName(user)}`)
      router.replace({
        name: authStore.isAuthUserAdmin ? RouteNames.ADMIN_EVENTS : RouteNames.LIST_EVENT,
      })
    }
  }
  DecLoading()
}

definePageMeta({ layout: 'default' })

useHead({
  title: 'Se connecter',
  meta: [
    { name: 'description', content: 'Connectez vous pour gérer vos droits à l\'image' },
    { property: 'og:title', content: 'Inscription' },
    { property: 'og:description', content: 'Connectez vous pour gérer vos droits à l\'image' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://be-right.co/login' },
    { property: 'og:locale', content: 'fr_FR' },
  ],
})
</script>
