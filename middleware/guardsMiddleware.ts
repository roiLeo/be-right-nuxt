import { useAuthStore } from '~~/store'

export default defineNuxtRouteMiddleware(to => {
  const authStore = useAuthStore()
  if (to.meta.isAuth && !authStore.getIsLoggedIn) {
    return navigateTo({
      name: 'login',
    })
  }
})
