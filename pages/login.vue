<template>
<Form
  v-slot="{ meta, isSubmitting }"
  :validation-schema="schema"
  :initial-values="initialValues"
  class="container grid grid-cols-1 gap-12 mx-auto mt-24 md:mt-32 md:grid-cols-2"
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

  <nuxt-img
    class="hidden object-cover w-2/3 max-w-5xl shadow-2xl TranslateUpAnimation cursor-none md:block"
    src="/static/camera.webp"
    width="1577"
    height="1920"
    sizes="xs:200px md:500px lg:1024"
    alt="Objectif d'appareil photo"
  />
</Form>
</template>

<script setup lang="ts">
import { object, string } from 'yup'
import { Form } from 'vee-validate'
import type { UserType, VeeValidateValues, WithoutId } from '@/types'
import type { Company } from '~~/store'
import { useAuthStore, useUiStore } from '~~/store'
import { RouteNames } from '~/helpers/routes'

const { storeUsersEntities, getUserfullName } = userHook()
const { storeCompanyEntities } = companyHook()
const { jwtDecode } = authHook()
const { IncLoading, DecLoading } = useUiStore()
const { setJWTasUser, setToken } = useAuthStore()
const uiStore = useUiStore()
const router = useRouter()

interface IForm extends VeeValidateValues {
  email: string
  password: string
}

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
  const cookieToken = useCookie('userToken')
  try {
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
          name: RouteNames.LIST_EVENT,
        })
      }
    }
  } catch (error) {
    console.error(error)
    $toast.error('Une erreur est survenue')
  }
  DecLoading()
}

definePageMeta({ layout: 'default' })
</script>
