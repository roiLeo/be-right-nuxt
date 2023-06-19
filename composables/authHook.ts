import { useJwt } from '@vueuse/integrations/useJwt'
import type { JwtPayload } from 'jsonwebtoken'
import type { UserType, ValidationRequest } from '@/types'
import { RoleEnum } from '@/types'
import type { Company } from '~~/store'
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
  const { resetAuthState, setJWTasUser, setToken } = useAuthStore()
  const { storeUsersEntities } = userHook()
  const { storeCompanyEntities } = companyHook()

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

  async function logWithToken(token: string) {
    const { data } = await $api().post<{ user: UserType; company: Company }>('user/token', { token })
    if (data) {
      const { user, company } = data

      if (company) {
        storeCompanyEntities(company)
      }

      if (user && user.token && process.env.JWT_SECRET) {
        setToken(user.token)
        storeUsersEntities(user, false)

        const decoded = jwtDecode(ref(user.token))

        if (decoded.value) {
          setJWTasUser(decoded.value)
          return decoded.value
        }
      }
    }
  }

  return {
    checkMailIsAlreadyExist,
    isJWTUserAdmin,
    jwtDecode,
    logout,
    logWithToken,
  }
}
