import { uniq } from '@antfu/utils'
import type { Group, GroupCreationPayload } from '~~/store'
import { ModalModeEnum, ModalNameEnum, useEmployeeStore, useUiStore } from '~~/store'
import { useGroupStore } from '~~/store/group/groupStore'

export default function groupHook() {
  const { $toast, $api } = useNuxtApp()

  const { IncLoading, DecLoading, setUiModal } = useUiStore()
  const groupStore = useGroupStore()
  const employeeStore = useEmployeeStore()
  const { fetchMany: fetchManyEmployees } = employeeHook()

  const { addMany, removeOne } = groupStore

  async function deleteGroup(id: number) {
    try {
      IncLoading()
      await $api().delete(`group/${id}`)
      removeOne(id)
      $toast.success('Groupe à été supprimé avec succès')
    } catch (error) {
      $toast.danger('Une erreur est survenue')
      console.error(error)
    }
    DecLoading()
  }

  async function fetchByUser() {
    IncLoading()
    try {
      const { data: groups } = await $api().get<Group[]>('group/user')
      if (groups && groups.length > 0) {
        addMany(groups)
      }
    } catch (error) {
      console.error(error)
      $toast.danger('Une erreur est survenue')
    }
    DecLoading()
  }

  async function fetchMany(ids: number[]) {
    IncLoading()
    try {
      if (ids.length > 0) {
        const { data } = await $api().get<Group[]>(`group/manyByIds?ids=${ids.join(',')}`)

        if (data && data.length > 0) {
          await fetchGroupRelations(data)

          addMany(data)
        }
      }
    } catch (error) {
      console.error(error)
      $toast.danger('Une erreur est survenue')
    }
    DecLoading()
  }

  async function fetchByEmployeeId(id: number) {
    IncLoading()
    try {
      const { data: groups } = await $api().get<Group[]>(`group/employeeId/${id}`)
      if (groups && groups.length > 0) {
        addMany(groups)
      }
    } catch (error) {
      console.error(error)
      $toast.danger('Une erreur est survenue')
    }
    DecLoading()
  }

  async function fetchUserGroupsAndRelations() {
    IncLoading()
    await fetchByUser()

    await fetchGroupRelations(groupStore.getAllArray)
    DecLoading()
  }

  async function postOne(group: GroupCreationPayload) {
    IncLoading()
    try {
      const { data } = await $api().post<Group>('group', {
        group,
      })
      if (data) {
        addMany([data])
        $toast.success('Groupe créé avec succès')
      }
    } catch (error) {
      console.error(error)
      $toast.danger('Une erreur est survenue')
    }
    DecLoading()
  }

  async function postOneCSV(dataForm: FormData) {
    IncLoading()
    try {
      const { data } = await $api().post<Group>('group/csv', dataForm, true)

      if (data) {
        addMany([data])
        $toast.success('Groupe créé avec succès')
      }
    } catch (error) {
      console.error(error)
      $toast.danger('Une erreur est survenue')
    }
    DecLoading()
  }

  async function patchOne(id: number, group: Partial<Group>) {
    IncLoading()
    try {
      const { data } = await $api().patch<Group>(`group/${id}`, {
        group,
      })
      if (data) {
        removeOne(id)
        addMany([data])
        $toast.success('Groupe modifié avec succès')
      }
    } catch (error) {
      console.error(error)
      $toast.danger('Une erreur est survenue')
    }
    DecLoading()
  }

  async function removeRecipients(employeeIds: number[], groupId: number) {
    IncLoading()
    try {
      if (employeeIds?.length > 0 && groupId) {
        const groupToUpdate = groupStore.getOne(groupId)

        const payload: Group = {
          ...groupToUpdate,
          employeeIds: groupToUpdate.employeeIds.filter(id => !employeeIds.includes(id)),
        }

        const { data } = await $api().patch<Group>(`group/${groupId}`, {
          group: payload,
        })
        if (data) {
          removeOne(groupId)
          addMany([data])
          $toast.success('Groupe modifié avec succès')
        }
      }
    } catch (error) {
      console.error(error)
      $toast.danger('Une erreur est survenue')
    }
    DecLoading()
  }

  async function fetchGroupRelations(groups: Group[]) {
    const missingEmployees = groups?.length > 0
      ? uniq(groups
        .reduce((acc, emp) => {
          if (emp && emp.employeeIds?.length > 0) {
            return [...acc, ...emp?.employeeIds]
          }
          return acc
        }, [] as number[]))
        .filter(id => !employeeStore.isAlreadyInStore(id))
      : []

    if (missingEmployees.length > 0) {
      await fetchManyEmployees(missingEmployees)
    }
  }

  function openAddRecipientModal(groupId: number) {
    setUiModal({
      modalMode: ModalModeEnum.EDIT,
      modalName: ModalNameEnum.ADD_RECIPIENT_TO_GROUP,
      isActive: true,
      data: {
        groupId,
      },
    })
  }

  function openDeleteConfirmModal(groupId: number) {
    setUiModal({
      modalMode: ModalModeEnum.DELETE,
      modalName: ModalNameEnum.DELETE_CONFIRM_GROUP,
      isActive: true,
      data: {
        groupId,
      },
    })
  }

  return {
    deleteGroup,
    fetchByEmployeeId,
    openAddRecipientModal,
    openDeleteConfirmModal,
    postOne,
    postOneCSV,
    patchOne,
    fetchByUser,
    fetchGroupRelations,
    fetchMany,
    fetchUserGroupsAndRelations,
    removeRecipients,
  }
}
