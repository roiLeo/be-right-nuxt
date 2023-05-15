import { FetchWrapper } from '~/helpers/api'
import { useAuthStore } from '~~/store'

export default defineNuxtPlugin(() => {
  function isProductionMode() {
    return parseInt(import.meta.env.VITE_PROD as string) === 1 && parseInt(import.meta.env.VITE_DEV as string) === 0
  }

  const { toFormat } = dateHook()
  const authStore = useAuthStore()

  return {
    provide: {
      isProductionMode: isProductionMode(),

      getApiUrl: isProductionMode() ? import.meta.env.VITE_API_URL?.toString() : import.meta.env.VITE_DEV_API_URL?.toString(),

      toFormat: (date: Date | string, format: string) => toFormat(date, format),

      api: () => {
        const api = new FetchWrapper({
          baseUrl: isProductionMode() ? import.meta.env.VITE_API_URL as string : import.meta.env.VITE_DEV_API_URL as string,
          token: authStore.getToken || undefined,
        })
        return api
      },

      authUser: authStore.user,

      isAuthUserAdmin: authStore.isAuthUserAdmin,
    },
  }
})
