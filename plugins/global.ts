import { useToast } from 'vue-toastification'
import { FetchWrapper } from '~/helpers/api'
import { getApiUrl } from '~/helpers/apiUrl'
import { useAuthStore } from '~~/store'

export default defineNuxtPlugin(() => {
  function isProductionMode() {
    const { NODE_ENV, VITE_MODE } = import.meta.env
    return (noUndefined(NODE_ENV) && noNull(NODE_ENV) && NODE_ENV === 'production')
      || (noUndefined(VITE_MODE) && noNull(VITE_MODE) && VITE_MODE === 'production')
  }

  const { toFormat } = dateHook()
  const authStore = useAuthStore()

  return {
    provide: {
      isProductionMode: isProductionMode(),

      getApiUrl: getApiUrl(),

      toast: useToast(),

      toFormat: (date: Date | string, format: string) => toFormat(date, format),

      api: () => {
        const api = new FetchWrapper({
          baseUrl: getApiUrl() || 'http://localhost:8080/',
          token: authStore.getToken || undefined,
        })
        return api
      },

      authUser: authStore.user,

      isAuthUserAdmin: authStore.isAuthUserAdmin,
    },
  }
})
