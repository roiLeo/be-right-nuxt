import { hasOwnProperty } from '@antfu/utils'
import { RoleEnum } from '@/types'
import type {
  PaginatedResponse,
  UserType,
} from '@/types'
import {
  useNotificationsSubscriptionStore,
  useUiStore,
  useUserStore,
} from '~~/store'
import type { PhotographerCreatePayload } from '~~/store/form/types'

export default function userHook() {
  const { $toast, $api } = useNuxtApp()

  const userStore = useUserStore()
  const notificationSubscriptionStore = useNotificationsSubscriptionStore()

  const { IncLoading, DecLoading } = useUiStore()

  async function fetchOne(userId: number) {
    try {
      IncLoading()
      const { data: user } = await $api().get<UserType>(`user/${userId}`)

      if (user) {
        storeUsersEntities(user, false)
      }
    } catch (error) {
      console.error(error)
      $toast.danger('Une erreur est survenue')
    }
  }

  /**
   * function to store all objetcs or arrays user's entities, and set user to current
   * @param user
   * @param isUserToSetCurrent
   */
  function storeUsersEntities(user: UserType, isUserToSetCurrent = true) {
    if (user.notificationSubscriptions && user.notificationSubscriptions.length > 0) {
      const missingNotifSubscriptions = user.notificationSubscriptions.filter(notifSub => !notificationSubscriptionStore.isAlreadyInStore(notifSub.id))
      notificationSubscriptionStore.addMany(missingNotifSubscriptions)
    }

    if (isUserToSetCurrent) {
      userStore.setCurrent(user)
    }

    if (userStore.isAlreadyInStore(user.id)) {
      userStore.updateOne(user.id, user)
    } else {
      userStore.addOne(user)
    }
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
        userStore.addMany(data.data)
      }
    } catch (error) {
      $toast.danger('Une erreur est survenue')
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
      $toast.danger('Une erreur est survenue')
      console.error(error)
    }
    DecLoading()
  }

  async function patchOne(id: number, user: UserType) {
    IncLoading()
    try {
      const { data } = await $api().patch<UserType>(`user/${id}`, { user })
      if (data && isUserType(data)) {
        userStore.updateOneUser(id, data)
        $toast.success('Utilisateur à été modifié avec succès')
      }
    } catch (error) {
      $toast.danger('Une erreur est survenue')
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
      case RoleEnum.OWNER:
        return 'Propriétaire'
      case RoleEnum.PHOTOGRAPHER:
        return 'Photographe'
      case RoleEnum.CUSTOMER:
        return 'Client'
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
            userStore.addMany(missingsUsers)
          }
        }
      }
    } catch (error) {
      $toast.danger('Une erreur est survenue')
      console.error(error)
    }
    DecLoading()
  }

  function isUserType(user: any): user is UserType {
    return hasOwnProperty(user, 'id') && hasOwnProperty(user, 'token')
  }

  function isArrayUserType(users: any[]): users is UserType[] {
    return users?.every(isUserType)
  }

  async function postPhotographer(photographer: PhotographerCreatePayload) {
    try {
      const { data } = await $api().post<UserType>('user/photographer', photographer)
      if (data && isUserType(data)) {
        userStore.addOne(data)
        return data
      }
    } catch (error) {
      $toast.danger('Une erreur est survenue')
      console.error(error)
    }
  }

  async function getPhotographerUserWorkedWith() {
    try {
      const { data, success } = await $api().get<UserType[]>('user/partners')
      if (data && success) {
        const partners = data.filter(user => !userStore.isAlreadyInStore(user.id))
        userStore.addMany(partners)
        return partners
      }
      return []
    } catch (error: any) {
      $toast.danger(error.error as string)
      console.error(error)
    }
  }

  function isUserAdmin(user: UserType) {
    return user?.roles === RoleEnum.ADMIN
  }

  function isUserOwner(user: UserType) {
    return user?.roles === RoleEnum.OWNER
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
    isUserOwner,
    isUserType,
    patchOne,
    postPhotographer,
    storeUsersEntities,
  }
}
