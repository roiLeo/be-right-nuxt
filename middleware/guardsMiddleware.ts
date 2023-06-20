import { useAuthStore } from '~~/store'

export default defineNuxtRouteMiddleware(async to => {
  const { $toast } = useNuxtApp()
  const authStore = useAuthStore()
  const { logWithToken, getCookie } = authHook()

  const cookieToken = getCookie()

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
  abortNavigation()
  return navigateTo({
    name: 'login',
  }, { replace: true })
}
