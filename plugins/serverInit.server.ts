import { useAuthStore } from '~~/store'

export default defineNuxtPlugin(async () => {
  let apiUrl: string | null = null
  const { storeUsersEntities } = userHook()
  const { storeCompanyEntities } = companyHook()
  const { jwtDecode } = authHook()
  const authStore = useAuthStore()
  const { setJWTasUser, setToken } = authStore

  if (process.env.NODE_ENV === 'development' && process.env.VITE_DEV_API_URL) {
    apiUrl = process.env.VITE_DEV_API_URL
  } else if (process.env.NODE_ENV === 'production' && process.env.VITE_API_URL) {
    apiUrl = process.env.VITE_API_URL
  }

  const cookieToken = useCookie('userToken')

  if (cookieToken.value && apiUrl && !authStore.getIsLoggedIn) {
    const response = await fetch(`${apiUrl}user/token`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': '',
      },
      body: JSON.stringify({ token: cookieToken.value }),
    })

    const data = await response.json()

    if (data) {
      const { user, company } = data

      if (company) {
        storeCompanyEntities(company)
      }

      if (user && user.token && process.env.JWT_SECRET) {
        setToken(user.token)
        storeUsersEntities(user, false)

        const decoded = jwtDecode(user.token)

        if (decoded.value) {
          setJWTasUser(decoded.value)
          const router = useRouter()
          const route = useRoute()

          router.push({
            name: route.name || 'evenement',
            query: {
              ...route.query,
            },
          })
        }
      }
    }
  }
})
