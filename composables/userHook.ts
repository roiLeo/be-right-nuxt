import { hasOwnProperty } from '@antfu/utils'
import { RoleEnum } from '@/types'
import type {
  UserType,
} from '@/types'
import type { Company } from '~~/store'
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

  function isUserType(user: any): user is UserType {
    return hasOwnProperty(user, 'id') && hasOwnProperty(user, 'token')
  }

  function isArrayUserType(users: any[]): users is UserType[] {
    return users?.every(isUserType)
  }

  function isUserAdmin(user: UserType) {
    return user?.roles === RoleEnum.ADMIN
  }

  function isUserOwner(user: UserType) {
    return user?.roles === RoleEnum.OWNER
  }

  async function fetchOne(userId: number) {
    IncLoading()
    const { data: user } = await $api().get<UserType>(`user/${userId}`)

    if (user && isUserType(user)) {
      storeUsersEntities(user, false)
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

  async function deleteUser(id: number) {
    IncLoading()
    await $api().delete(`user/${id}`)
    userStore.deleteOne(id)
    $toast.success('Utilisateurs à été supprimé avec succès')
    DecLoading()
  }

  async function patchOne(id: number, user: UserType) {
    IncLoading()
    const { data } = await $api().patch<UserType>(`user/${id}`, { user })
    if (data && isUserType(data)) {
      userStore.updateOneUser(id, data)
      $toast.success('Utilisateur à été modifié avec succès')
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
    if (ids.length > 0) {
      const { data: users } = await $api().get<UserType[]>(`user/many/?ids=${ids.join(',')}`)

      if (users && users.length > 0 && isArrayUserType(users)) {
        const missingsUsers = users.filter(user => !userStore.isAlreadyInStore(user.id))
        if (missingsUsers.length > 0) {
          userStore.addMany(missingsUsers)
        }
      }
    }
    DecLoading()
  }

  async function postPhotographer(photographer: PhotographerCreatePayload) {
    const { data } = await $api().post<UserType>('user/photographer', photographer)
    if (data && isUserType(data)) {
      userStore.addOne(data)
      return data
    }
  }

  async function getPhotographerUserWorkedWith() {
    const { data, success } = await $api().get<UserType[]>('user/partners')
    if (data && isArrayUserType(data) && success) {
      const partners = data.filter(user => !userStore.isAlreadyInStore(user.id))
      userStore.addMany(partners)
      return partners
    }
    return []
  }

  async function postUserSignature(base64Signature: string, userId: number) {
    IncLoading()
    const { data, success } = await $api().patch<{ user: UserType; company: Company }>(`user/signature/${userId}`, { signature: base64Signature })
    if (data && success && isUserType(data)) {
      const { user } = data
      storeUsersEntities(user)
      $toast.success('Signature enregistrée avec succès')
    }
    DecLoading()
  }

  return {
    deleteUser,
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
    postUserSignature,
    storeUsersEntities,
  }
}
