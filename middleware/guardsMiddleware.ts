import { useAuthStore } from '~~/store'

export default defineNuxtRouteMiddleware(async to => {
  const { $toast } = useNuxtApp()
  const authStore = useAuthStore()
  const { logWithToken } = authHook()

  const cookieToken = useCookie('userToken')

  if (to.meta.isAuth && !authStore.getIsLoggedIn) {
    if (cookieToken.value) {
      const jwt = await logWithToken(cookieToken.value)
      if (jwt) {
        return
      }
    }

    $toast?.denied('Vous n\'êtes pas connecté')
    return redirectToLogin()
  }

  if (to.meta.isAdmin && !authStore.isAuthUserAdmin) {
    return redirectToLogin()
  }
})

function redirectToLogin() {
  return navigateTo({
    name: 'login',
  }, { replace: true })
}
