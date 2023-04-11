import { verify } from 'jsonwebtoken'
import { getApiUrl } from '~/helpers/apiUrl'
import { useAuthStore } from '~~/store'
import type { JWTDecodedType } from '~~/types'

export default defineNuxtPlugin(async () => {
  const apiUrl = getApiUrl()
  const { storeUsersEntities } = userHook()
  const { storeCompanyEntities } = companyHook()
  // const { isJWTUserAdmin } = authHook()
  const authStore = useAuthStore()
  const { setJWTasUser, setToken } = authStore

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

        const decoded = verify(user.token, process.env.JWT_SECRET) as JWTDecodedType
        if (decoded) {
          setJWTasUser(decoded)
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
