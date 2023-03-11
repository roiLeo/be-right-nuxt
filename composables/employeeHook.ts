import { uniq } from '@antfu/utils'
import type { AddressType, EmployeeType, FileType, PaginatedResponse } from '@/types'
import { isArrayOfNumbers } from '~~/utils'
import {
  useAddressStore,
  // useAnswerStore,
  useEmployeeStore,
  useFileStore,
  useUiStore,
  useUserStore,
} from '~~/store'

export default function employeeHook() {
  const { $toast, $api } = useNuxtApp()

  const employeeStore = useEmployeeStore()
  const userStore = useUserStore()
  // const { createMany: createManyAnswers } = useAnswerStore()
  const { createMany: createManyFiles } = useFileStore()
  const { IncLoading, DecLoading } = useUiStore()
  const addressStore = useAddressStore()
  const { addMany: addManyAddresses } = addressStore
  const { filteringFilesNotInStore } = fileHook()
  // const { filteringAnswersNotInStore } = answerHook()
  const { isAddressType } = addressHook()

  function getEmployeeStatusSignature(employee: EmployeeType): string {
    if (employee.hasSigned) {
      return 'Accepté'
    } else {
      if (employee.signedAt) {
        return 'Refusé'
      }
      return 'En attente'
    }
  }

  function getEmployeeStatusColor(employee: EmployeeType): string {
    if (employee.hasSigned) {
      return 'text-green'
    } else {
      if (employee.signedAt) {
        return 'text-red'
      }
      return 'text-orange'
    }
  }

  function storeEmployeeRelationsEntities(employees: EmployeeType[]): EmployeeType[] {
    if (employees?.length > 0) {
      const missingIds = employees
        .map(employee => employee.id)
        .filter(id => !employeeStore.isAlreadyInStore(id))

      if (missingIds.length > 0) {
        // TODO : optimize this with reduce
        const employeesToStore = employees
          .filter(employee => missingIds.includes(employee.id))

        employeesToStore.forEach(employee => {
          // let employeeAnswers: AnswerType[] = []
          let employeeFiles: FileType[] = []

          if (employee.files && employee.files.length > 0 && !isArrayOfNumbers(employee.files)) {
            employeeFiles = filteringFilesNotInStore(employee.files as FileType[])
            if (employeeFiles.length > 0) {
              createManyFiles(employeeFiles)
            }
          }

          // if (employee.answers && employee.answers.length > 0 && !isArrayOfNumbers(employee.answers)) {
          //   employeeAnswers = filteringAnswersNotInStore(employee.answers as AnswerType[])
          //   if (employeeAnswers.length > 0) {
          //     createManyAnswers(employeeAnswers)
          //   }
          // }

          if (employee.address && isAddressType(employee.address)) {
            if (!addressStore.isAlreadyInStore(employee.addressId)) {
              addManyAddresses([employee.address])
            }
          }
        })
        employeeStore.addMany(employeesToStore)
        return employeesToStore
      }
    }
    return []
  }

  async function fetchOne(id: number) {
    IncLoading()
    try {
      const { data } = await $api().get<EmployeeType>(`employee/${id}`)
      if (data) {
        storeEmployeeRelationsEntities([data])
      }
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
    DecLoading()
  }

  async function fetchEmployeesByEventId(eventId: number) {
    IncLoading()
    try {
      const { data } = await $api().get<EmployeeType[]>(`employee/event/${eventId}`)

      if (data) {
        employeeStore.addMany(data)
      }
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
    DecLoading()
  }

  async function fetchMany(employeeIds: number[]) {
    IncLoading()
    try {
      if (employeeIds.length > 0) {
        const { data } = await $api().get<EmployeeType[]>(`employee/manyByIds?ids=${employeeIds.join(',')}`)

        if (data && data.length > 0) {
          const missingsEmployees = data.filter(user => !employeeStore.isAlreadyInStore(user.id))

          if (missingsEmployees.length > 0) {
            employeeStore.addMany(missingsEmployees)
          }
        }
      }
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
    DecLoading()
  }

  async function fetchAllByUserId(userId: number) {
    IncLoading()
    try {
      const { data } = await $api().get<EmployeeType[]>(`employee/user/${userId}`)

      if (data) {
        storeEmployeeRelationsEntities(data)
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
      let finalUrl = 'employee'
      if (url) {
        finalUrl += `${url}`
      }

      const { data } = await $api().get<PaginatedResponse<EmployeeType>>(`${finalUrl}`)
      if (data) {
        storeEmployeeRelationsEntities(data.data)
      }
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
    DecLoading()
  }

  async function deleteOne(id: number) {
    IncLoading()
    try {
      await $api().delete(`employee/${id}`)
      employeeStore.deleteOneEmployee(id)
      $toast.success('Destinataire supprimé avec succès')
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
    DecLoading()
  }

  async function patchOne(id: number, payload: EmployeeType) {
    IncLoading()
    try {
      const { data } = await $api().patch<EmployeeType>(`employee/${id}`, payload)
      if (data) {
        employeeStore.updateOne(id, data)
        $toast.success('Destinataire modifié avec succès')
      }
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
    DecLoading()
  }

  async function postOne(employee: EmployeeType, address: AddressType, userId: number) {
    try {
      const { data } = await $api().post<EmployeeType>(`employee/${userId}`, { employee, address })

      if (data) {
        const user = userStore.getOne(userId)
        userStore.updateOne(userId, {
          ...user,
          employeeIds: [...user.employeeIds, data.id],
        })
        employeeStore.addMany([data])
        $toast.success('Destinataire créé avec succès')
        return data
      }
      return null
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
  }

  async function postManyForEvent(employees: EmployeeType[], eventId: number, userId: number) {
    IncLoading()
    try {
      const { data } = await $api().post<EmployeeType[]>(`employee/manyonevent/${eventId}/${userId}`, employees)

      if (data) {
        const user = userStore.getOne(userId)
        userStore.updateOne(userId, {
          ...user,
        })
        employeeStore.addMany(data)
        $toast.success('Destinataires créés avec succès')
      }
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
    DecLoading()
  }

  function getEmployeeFullname(employee: EmployeeType): string {
    let str = ''
    if (employee?.firstName)
      str += employee.firstName
    if (employee?.lastName)
      str += ` ${employee.lastName}`
    return str
  }

  return {
    deleteOne,
    fetchAll,
    fetchAllByUserId,
    fetchOne,
    fetchMany,
    getEmployeeFullname,
    fetchEmployeesByEventId,
    getEmployeeStatusColor,
    getEmployeeStatusSignature,
    patchOne,
    postManyForEvent,
    postOne,
    storeEmployeeRelationsEntities,
  }
}
