import { verify } from 'jsonwebtoken'
import { useAuthStore } from '~~/store'
import type { JWTDecodedType } from '~~/types'

export default defineNuxtPlugin(async () => {
  let apiUrl: string | null = null
  const { storeUsersEntities } = userHook()
  // const { isJWTUserAdmin } = authHook()
  const { setJWTasUser } = useAuthStore()

  if (process.env.NODE_ENV === 'development' && process.env.VITE_DEV_API_URL) {
    apiUrl = process.env.VITE_DEV_API_URL
  } else if (process.env.NODE_ENV === 'production' && process.env.VITE_DEV_API_URL) {
    apiUrl = process.env.VITE_DEV_API_URL
  }

  const cookieToken = useCookie('userToken')

  if (cookieToken.value && apiUrl) {
    const response = await fetch(`${apiUrl}/user/token`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': '',
      },
      body: JSON.stringify({ token: cookieToken.value }),
    })
    const user = await response.json()

    if (user && process.env.JWT_SECRET) {
      storeUsersEntities(user, false)

      const decoded = verify(user.token, process.env.JWT_SECRET) as JWTDecodedType
      if (decoded) {
        setJWTasUser(decoded)
        const router = useRouter()
        router.push({
          name: 'evenement',
        })

        // if (isJWTUserAdmin(decoded)) {
        //   // navigateTo('/evenement')
        // }
      }
    }
  }
})
