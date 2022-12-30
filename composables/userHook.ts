import { hasOwnProperty } from '@antfu/utils'
// import { useCookies } from 'vue3-cookies'
import { RoleEnum } from '@/types'
import type {
  EmployeeType,
  EventType,
  FileType,
  Loginpayload,
  PaginatedResponse,
  PhotographerCreatePayload,
  RegisterPayload,
  ThemeEnum,
  UserType,
} from '@/types'
import { isArrayOfNumbers } from '@/utils'
import {
  useAnswerStore,
  useBugStore,
  useEmployeeStore,
  useEventStore,
  useFileStore,
  useMainStore,
  useTableStore,
  useUiStore,
  useUserStore,
} from '~~/store'

export default function userHook() {
  const { $toast, $api } = useNuxtApp()

  const userStore = useUserStore()
  const eventStore = useEventStore()
  const fileStore = useFileStore()

  const { IncLoading, DecLoading } = useUiStore()
  const { storeEmployeeRelationsEntities } = employeeHook()
  // const { cookies } = useCookies()
  // TODO use cookies to see if user is logged in

  const router = useRouter()

  async function login(payload: Loginpayload) {
    try {
      IncLoading()
      const { data: user } = await $api().post<UserType>('user/login', payload)

      if (user) {
        storeUsersEntities(user, true)
        // cookies.set('userToken', user.token)
        $toast.success(`Heureux de vous revoir ${getUserfullName(user)}`)
      }
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
    DecLoading()
  }

  async function register(payload: RegisterPayload) {
    try {
      IncLoading()
      const { data: user } = await $api().post<UserType>('user', payload)

      if (user) {
        storeUsersEntities(user)
        // cookies.set('userToken', user.token)
        redirectBaseOneCurrentUserRole(user)
        $toast.success('Vous êtes inscrit avec succès')
      }
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
    DecLoading()
  }

  async function fetchOne(userId: number) {
    try {
      IncLoading()
      const { data: user } = await $api().get<UserType>(`user/${userId}`)

      if (user) {
        storeUsersEntities(user, false)
      }
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
  }

  /**
   * function to store all objetcs or arrays user's entities, and set user to current
   * @param user
   * @param isUserToSetCurrent
   */
  function storeUsersEntities(user: UserType, isUserToSetCurrent = true) {
    if (user.events && user.events.length > 0 && !isArrayOfNumbers(user.events)) {
      const userEvents = user.events as EventType[]
      const eventsToStore = userEvents.filter(event => !eventStore.isAlreadyInStore(event.id))
      eventStore.createMany(eventsToStore)
      user.events = eventsToStore.map(event => event.id)
    }
    if (user.employee && user.employee.length > 0 && !isArrayOfNumbers(user.employee)) {
      const employeesToStore = storeEmployeeRelationsEntities(user.employee.map(e => ({
        ...e as EmployeeType,
        createdByUser: user.id,
      })))
      user.employee = employeesToStore.map(employee => employee.id)
    }
    if (user.files && user.files.length > 0 && !isArrayOfNumbers(user.files)) {
      const files = user.files as FileType[]
      const filesToStore = files.filter(file => !fileStore.isAlreadyInStore(file.id))
      fileStore.createMany(filesToStore)
      user.files = filesToStore.map(file => file.id)
    }
    if (isUserToSetCurrent) {
      userStore.setCurrent(user)
    }
    if (userStore.isAlreadyInStore(user.id)) {
      userStore.updateOne(user.id, user)
    } else {
      userStore.createOne(user)
    }
  }

  function storeUsersEntitiesForManyUsers(users: UserType[]): void {
    if (users.length > 0) {
      const events = users.reduce((acc, user) => [...acc, ...user?.events as EventType[]], [] as EventType[])
      const eventsToStore = events.filter(event => !eventStore.isAlreadyInStore(event.id))
      if (eventsToStore.length > 0) {
        eventStore.createMany(eventsToStore)
      }

      const employees = users.reduce((acc, user) => [...acc, ...user.employee as EmployeeType[]], [] as EmployeeType[])
      storeEmployeeRelationsEntities(employees)

      const files = users.reduce((acc, user) => [...acc, ...user.files as FileType[]], [] as FileType[])
      const filesToStore = files.filter(file => !fileStore.isAlreadyInStore(file.id))
      if (filesToStore.length > 0) {
        fileStore.createMany(filesToStore)
      }

      const missingsUsers = users.filter(user => !userStore.isAlreadyInStore(user.id))
      if (missingsUsers.length > 0) {
        const usersToStore = missingsUsers.map(user => {
          const userEvents = user.events as EventType[]
          const userEmployees = user.employee as EmployeeType[]
          const userFiles = user.files as FileType[]
          return {
            ...user,
            events: userEvents.map(event => event.id),
            employee: userEmployees.map(employee => employee.id),
            files: userFiles.map(file => file.id),
          }
        })
        userStore.createMany(usersToStore)
      }
    }
  }

  async function userToggleTheme(theme: ThemeEnum) {
    try {
      IncLoading()
      const id = userStore.entities.current?.id
      if (id) {
        const { data } = await $api().patch<UserType>(`user/theme/${id}`, theme)
        if (data && isUserType(data)) {
          userStore.updateOne(id, data)
        }
      }
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
    DecLoading()
  }

  async function fetchAll(url?: string) {
    IncLoading()
    try {
      let finalUrl = 'user'
      if (url) {
        finalUrl += `${url}`
      }
      const { data } = await $api().get<PaginatedResponse<UserType>>(finalUrl)

      if (data && isArrayUserType(data.data)) {
        storeUsersEntitiesForManyUsers(data.data)
      }
    } catch (error) {
      $toast.error('Une erreur est survenue')
      console.error(error)
    }
    DecLoading()
  }

  async function deleteUser(id: number) {
    try {
      IncLoading()
      await $api().delete(`user/${id}`)
      userStore.deleteOne(id)
      $toast.success('Utilisateurs à été supprimé avec succès')
    } catch (error) {
      $toast.error('Une erreur est survenue')
      console.error(error)
    }
    DecLoading()
  }

  async function patchOne(id: number, user: UserType) {
    IncLoading()
    try {
      const { data } = await $api().patch<UserType>(`user/${id}`, user)
      if (data && isUserType(data)) {
        userStore.updateOne(id, data)
        $toast.success('Utilisateur à été modifié avec succès')
      }
    } catch (error) {
      $toast.error('Une erreur est survenue')
      console.error(error)
    }
    DecLoading()
  }

  function getRoleTranslation(role: RoleEnum) {
    switch (role) {
      case RoleEnum.ADMIN:
        return 'Administrateur'
      case RoleEnum.USER:
        return 'Utilisateur'
      case RoleEnum.EMPLOYEE:
        return 'Destinataire'
      case RoleEnum.SUPER_USER:
        return 'Super utilisateur'
      case RoleEnum.COMPANY:
        return 'Entreprise'
      case RoleEnum.PHOTOGRAPHER:
        return 'Photographe'
      case RoleEnum.CUSTOMER:
        return 'Client'
      default:
        return 'Utilisateur'
    }
  }

  function getUserfullName(user: Pick<UserType, 'firstName' | 'lastName'>) {
    let str = ''
    if (user?.firstName)
      str += user.firstName
    if (user?.lastName)
      str += ` ${user.lastName}`
    return str
  }

  async function fetchMany(ids: number[]) {
    IncLoading()
    try {
      if (ids.length > 0) {
        const { data: users } = await $api().get<UserType[]>(`user/many/?ids=${ids.join(',')}`)

        if (users && users.length > 0 && isArrayUserType(users)) {
          const missingsUsers = users.filter(user => !userStore.isAlreadyInStore(user.id))
          if (missingsUsers.length > 0) {
            userStore.createMany(missingsUsers)
          }
        }
      }
    } catch (error) {
      $toast.error('Une erreur est survenue')
      console.error(error)
    }
    DecLoading()
  }

  function isUserType(user: any): user is UserType {
    return hasOwnProperty(user, 'id') && hasOwnProperty(user, 'token')
  }

  function isArrayUserType(users: any[]): users is UserType[] {
    return users.every(isUserType)
  }

  /**
   * redirection based on current user's role in store
   */
  function redirectBaseOneCurrentUserRole(user: UserType) {
    if (user && router) {
      if (user.roles === RoleEnum.ADMIN) {
        router.push({ name: 'admin.events' })
      } else {
        router.push({ name: 'user.events' })
      }
    } else {
      router.push({ name: 'login' })
    }
  }

  async function postPhotographer(photographer: PhotographerCreatePayload) {
    try {
      const { data } = await $api().post<UserType>('user/photographer', photographer)
      if (data && isUserType(data)) {
        userStore.createOne(data)
        return data
      }
    } catch (error) {
      $toast.error('Une erreur est survenue')
      console.error(error)
    }
  }

  async function getPhotographerUserWorkedWith(userId: number) {
    try {
      const { data } = await $api().get<UserType[]>(`user/partners/${userId}`)
      if (data) {
        userStore.createMany(data)
        return data
      }
    } catch (error: any) {
      $toast.error(error.error as string)
      console.error(error)
    }
  }

  function isUserAdmin(user: UserType) {
    return user?.roles === RoleEnum.ADMIN
  }

  return {
    deleteUser,
    fetchAll,
    fetchMany,
    fetchOne,
    getPhotographerUserWorkedWith,
    getRoleTranslation,
    getUserfullName,
    isArrayUserType,
    isUserAdmin,
    isUserType,
    login,
    patchOne,
    postPhotographer,
    redirectBaseOneCurrentUserRole,
    register,
    storeUsersEntities,
    userToggleTheme,
  }
}
