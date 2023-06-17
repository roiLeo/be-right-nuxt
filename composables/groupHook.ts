import { hasOwnProperty, uniq } from '@antfu/utils'
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
    IncLoading()
    await $api().delete(`group/${id}`)
    removeOne(id)
    $toast.success('Groupe à été supprimé avec succès')
    DecLoading()
  }

  async function fetchByUser() {
    IncLoading()
    const { data: groups } = await $api().get<Group[]>('group/user')
    if (groups && groups.length > 0 && areGroupTypes(groups)) {
      addMany(groups)
    }
    DecLoading()
  }

  async function fetchMany(ids: number[]) {
    IncLoading()
    if (ids.length > 0) {
      const { data } = await $api().get<Group[]>(`group/manyByIds?ids=${ids.join(',')}`)

      if (data && data.length > 0 && areGroupTypes(data)) {
        await fetchGroupRelations(data)

        addMany(data)
      }
    }
    DecLoading()
  }

  async function fetchByEmployeeId(id: number) {
    IncLoading()
    const { data } = await $api().get<Group[]>(`group/employeeId/${id}`)
    const groups = data?.filter(group => !groupStore.isAlreadyInStore(group?.id))
    if (groups && groups.length > 0 && areGroupTypes(groups)) {
      addMany(groups)
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
    const { data } = await $api().post<Group>('group', {
      group,
    })
    if (data && isGroupType(data)) {
      addMany([data])
      $toast.success('Groupe créé avec succès')
    }
    DecLoading()
  }

  async function postOneCSV(dataForm: FormData) {
    IncLoading()
    const { data } = await $api().post<Group>('group/csv', dataForm, true)

    if (data && isGroupType(data)) {
      addMany([data])
      $toast.success('Groupe créé avec succès')
    }
    DecLoading()
  }

  async function patchOne(id: number, group: Partial<Group>) {
    IncLoading()
    const { data } = await $api().patch<Group>(`group/${id}`, {
      group,
    })
    if (data && isGroupType(data)) {
      removeOne(id)
      addMany([data])
      $toast.success('Groupe modifié avec succès')
    }
    DecLoading()
  }

  async function removeRecipients(employeeIds: number[], groupId: number) {
    IncLoading()
    if (employeeIds?.length > 0 && groupId) {
      const groupToUpdate = groupStore.getOne(groupId)

      const payload: Group = {
        ...groupToUpdate,
        employeeIds: groupToUpdate.employeeIds.filter(id => !employeeIds.includes(id)),
      }

      const { data } = await $api().patch<Group>(`group/${groupId}`, {
        group: payload,
      })
      if (data && isGroupType(data)) {
        removeOne(groupId)
        addMany([data])
        $toast.success('Groupe modifié avec succès')
      }
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

  function isGroupType(obj: unknown): obj is Group {
    return hasOwnProperty(obj, 'name')
      && hasOwnProperty(obj, 'description')
      && hasOwnProperty(obj, 'employeeIds')
  }

  function areGroupTypes(objs: unknown[]): objs is Group[] {
    return objs.every(obj => isGroupType(obj))
  }

  return {
    areGroupTypes,
    deleteGroup,
    fetchByEmployeeId,
    isGroupType,
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
