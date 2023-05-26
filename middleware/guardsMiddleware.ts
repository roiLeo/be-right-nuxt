import { useAuthStore } from '~~/store'

export default defineNuxtRouteMiddleware(to => {
  const { $toast } = useNuxtApp()
  const authStore = useAuthStore()

  if (to.meta.isAuth && !authStore.getIsLoggedIn) {
    $toast.denied('Vous n\'êtes pas connecté')
    return navigateTo({
      name: 'login',
    })
  }

  if (to.meta.isAdmin && !authStore.isAuthUserAdmin) {
    $toast.denied('Vous n\'êtes pas Administrateur')
    return navigateTo({
      name: 'login',
    })
  }
})
