import { useJwt } from '@vueuse/integrations/useJwt'
import type { JwtPayload } from 'jsonwebtoken'
import type { ValidationRequest } from '@/types'
import { RoleEnum } from '@/types'
import {
  useAddressStore,
  useAnswerStore,
  useAuthStore,
  useCompanyStore,
  useEmployeeStore,
  useEventStore,
  useFileStore,
  useFormStore,
  useGroupStore,
  useNotificationsStore,
  useNotificationsSubscriptionStore,
  useTableStore,
  useUiStore,
  useUserStore,
} from '~~/store'

export default function authHook() {
  const { $toast, $api } = useNuxtApp()

  const addressStore = useAddressStore()
  const answerStore = useAnswerStore()
  const userStore = useUserStore()
  const companyStore = useCompanyStore()
  const notificationStore = useNotificationsStore()
  const notificationSubscriptionStore = useNotificationsSubscriptionStore()
  const employeeStore = useEmployeeStore()
  const eventStore = useEventStore()
  const fileStore = useFileStore()
  const formStore = useFormStore()
  const groupStore = useGroupStore()
  const tableStore = useTableStore()
  const uiStore = useUiStore()
  const router = useRouter()
  const { resetAuthState } = useAuthStore()

  function logout() {
    const cookieToken = useCookie('userToken')
    cookieToken.value = null
    $api().deleteCredentials()
    router.replace({ name: 'index' })

    addressStore.resetState()
    answerStore.resetState()
    companyStore.$reset()
    employeeStore.resetState()
    eventStore.resetState()
    fileStore.resetState()
    formStore.resetState()
    groupStore.resetState()
    notificationStore.$reset()
    notificationSubscriptionStore.$reset()
    tableStore.resetTableState()
    uiStore.resetUIState()
    userStore.resetState()

    resetAuthState()

    $toast?.success('Vous êtes déconnecté')
  }

  async function checkMailIsAlreadyExist(email: string) {
    const { data } = await $api().post<ValidationRequest>('user/isMailAlreadyExist', { email })
    return data
  }

  function jwtDecode(jwt: Ref<string>) {
    const { payload } = useJwt(jwt)
    return payload
  }

  function isJWTUserAdmin(user: JwtPayload) {
    return user?.roles.includes(RoleEnum.ADMIN)
  }

  return {
    checkMailIsAlreadyExist,
    isJWTUserAdmin,
    jwtDecode,
    logout,
  }
}
