// import { useCookies } from 'vue3-cookies'
import type { JWTDecodedType, ValidationRequest } from '@/types'
import { RoleEnum } from '@/types'
import {
  useAuthStore,
  // useAnswerStore,
  // useBugStore,
  useEmployeeStore,
  useEventStore,
  useFileStore,
  useTableStore,
  useUiStore,
  useUserStore,
} from '~~/store'

export default function authHook() {
  const { $toast, $api } = useNuxtApp()

  const userStore = useUserStore()
  // const answerStore = useAnswerStore()
  // const bugStore = useBugStore()
  const employeeStore = useEmployeeStore()
  const eventStore = useEventStore()
  const fileStore = useFileStore()
  const tableStore = useTableStore()
  const uiStore = useUiStore()
  const router = useRouter()
  const { resetAuthState } = useAuthStore()

  function logout() {
    // api.deleteCredentials()
    // TODO add deletecredentials functions

    // answerStore.resetState()
    // bugStore.resetState()
    employeeStore.resetState()
    eventStore.resetState()
    fileStore.resetState()
    tableStore.resetTableState()
    uiStore.resetUIState()
    userStore.resetState()

    resetAuthState()

    const cookieToken = useCookie('userToken')
    cookieToken.value = null

    router.replace({ name: 'index' })
    $toast.success('Vous êtes déconnecté')
  }

  async function checkMailIsAlreadyExist(email: string) {
    const { data } = await $api().post<ValidationRequest>('user/isMailAlreadyExist', email)
    return data
  }

  // function getRouteName(routeName: string) {
  //   const roleRoutePrefix = userStore.getRoutePrefixBasedOnRole
  //   if (roleRoutePrefix) {
  //     return `${roleRoutePrefix}.${routeName}`
  //   }
  //   return ''
  // }

  function jwtDecode(jwt: any): JWTDecodedType | null {
    if (typeof jwt !== 'string' && !(jwt instanceof String))
      return null

    const splitted = jwt.split('.')
    if (splitted.length < 2)
      return null

    const obj1 = JSON.parse(window.atob(splitted[0]))
    const obj2 = JSON.parse(window.atob(splitted[1]))
    return Object.assign({}, obj1, obj2)
  }

  function isJWTUserAdmin(user: JWTDecodedType) {
    return user?.roles.includes(RoleEnum.ADMIN)
  }

  return {
    checkMailIsAlreadyExist,
    isJWTUserAdmin,
    // getRouteName,
    jwtDecode,
    // loginWithToken,
    logout,
  }
}
