// import { useCookies } from 'vue3-cookies'
import type { JWTDecodedType, ValidationRequest } from '@/types'
import { RoleEnum, UserType } from '@/types'
import {
  // useAnswerStore,
  // useBugStore,
  useEmployeeStore,
  useEventStore,
  useFileStore,
  // useMainStore,
  useTableStore,
  useUiStore,
  useUserStore,
} from '~~/store'

export default function authHook() {
  const { $toast, $api } = useNuxtApp()

  const userStore = useUserStore()
  // const mainStore = useMainStore()
  // const answerStore = useAnswerStore()
  // const bugStore = useBugStore()
  const employeeStore = useEmployeeStore()
  const eventStore = useEventStore()
  const fileStore = useFileStore()
  const tableStore = useTableStore()
  const uiStore = useUiStore()
  // const { setThemeClass } = mainHook()
  const { storeUsersEntities } = userHook()
  const { IncLoading, DecLoading } = useUiStore()
  const router = useRouter()
  // const { cookies } = useCookies()
  // TODO use cookies to see if user is logged in

  function logout() {
    // api.deleteCredentials()
    // TODO add deletecredentials functions
    userStore.removeCurrent()
    // cookies.remove('userToken')
    // answerStore.resetState()
    // bugStore.resetState()
    employeeStore.resetState()
    eventStore.resetState()
    fileStore.resetState()
    // mainStore.resetAllState()
    tableStore.resetTableState()
    uiStore.resetUIState()
    userStore.resetState()

    router.replace({ name: 'home' })
    $toast.success('Vous êtes déconnecté')
  }

  // async function loginWithToken(token: string) {
  //   IncLoading()
  //   try {
  //     const { data: user } = await $api().post<UserType>('user/token', { token })
  //     if (user) {
  //       // setThemeClass(user.theme)
  //       storeUsersEntities(user, true)
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  //   DecLoading()
  // }

  async function checkMailIsAlreadyExist(email: string) {
    const { data } = await $api().post<ValidationRequest>('user/isMailAlreadyExist', { email })
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
