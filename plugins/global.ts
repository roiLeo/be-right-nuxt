import { useToast } from 'vue-toastification'
// import useDate from '~~/composables/useDate'
// import { FetchWrapper } from '~/helper/api'

export default defineNuxtPlugin(() => {
  function isProductionMode() {
    return parseInt(import.meta.env.VITE_PROD as string) === 1 && parseInt(import.meta.env.VITE_DEV as string) === 0
  }

  // const { toFormat } = useDate()

  return {
    provide: {
      isProductionMode: isProductionMode(),
      getApiUrl: isProductionMode() ? import.meta.env.VITE_API_URL?.toString() : import.meta.env.VITE_DEV_API_URL?.toString(),
      toast: useToast(),
      // toFormat: (date: Date | string, format: string) => toFormat(date, format),
      // api: () => {
      //   const api = new FetchWrapper({
      //     baseUrl: isProductionMode() ? import.meta.env.VITE_API_URL as string : import.meta.env.VITE_DEV_API_URL as string,
      //     token: import.meta.env.VITE_API_TOKEN as string,
      //   })
      //   return api
      // },
    },
  }
})
