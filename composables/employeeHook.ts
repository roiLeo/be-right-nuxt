import { hasOwnProperty } from '@antfu/utils'
import type { AddressType, EmployeeType, FileType, PaginatedResponse } from '@/types'
import { isArrayOfNumbers } from '~~/utils'
import {
  useAddressStore,
  useCompanyStore,
  useEmployeeStore,
  useFileStore,
  useUiStore,
} from '~~/store'

export default function employeeHook() {
  const { $toast, $api } = useNuxtApp()

  const employeeStore = useEmployeeStore()
  const companyStore = useCompanyStore()
  const { createMany: createManyFiles } = useFileStore()
  const { IncLoading, DecLoading } = useUiStore()
  const addressStore = useAddressStore()
  const { addMany: addManyAddresses } = addressStore
  const { filteringFilesNotInStore } = fileHook()
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

  function isEmployeeType(arg: unknown): arg is EmployeeType {
    return hasOwnProperty(arg, 'email')
      && hasOwnProperty(arg, 'phone')
      && hasOwnProperty(arg, 'slug')
      && hasOwnProperty(arg, 'firstName')
      && hasOwnProperty(arg, 'lastName')
  }

  function areEmployeeTypes(args: unknown[]): args is EmployeeType[] {
    return args.every(arg => isEmployeeType(arg))
  }

  async function fetchOne(id: number) {
    IncLoading()
    const { data } = await $api().get<EmployeeType>(`employee/${id}`)
    if (data && isEmployeeType(data)) {
      storeEmployeeRelationsEntities([data])
    }
    DecLoading()
  }

  async function fetchEmployeesByEventId(eventId: number) {
    IncLoading()
    const { data } = await $api().get<EmployeeType[]>(`employee/event/${eventId}`)

    if (data && areEmployeeTypes(data)) {
      employeeStore.addMany(data)
    }
    DecLoading()
  }

  async function fetchMany(employeeIds: number[]) {
    IncLoading()
    if (employeeIds.length > 0) {
      const { data } = await $api().get<EmployeeType[]>(`employee/manyByIds?ids=${employeeIds.join(',')}`)

      if (data && data.length > 0 && areEmployeeTypes(data)) {
        const missingsEmployees = data.filter(user => !employeeStore.isAlreadyInStore(user.id))

        if (missingsEmployees.length > 0) {
          employeeStore.addMany(missingsEmployees)
        }
      }
    }
    DecLoading()
  }

  async function fetchAllByUserId(userId: number) {
    IncLoading()
    const { data } = await $api().get<EmployeeType[]>(`employee/user/${userId}`)

    if (data && areEmployeeTypes(data)) {
      storeEmployeeRelationsEntities(data)
    }
    DecLoading()
  }

  async function fetchAll(url?: string) {
    IncLoading()
    // TODO replace by paginated  request
    let finalUrl = 'employee'
    if (url) {
      finalUrl += `${url}`
    }

    const { data } = await $api().get<PaginatedResponse<EmployeeType>>(`${finalUrl}`)
    if (data) {
      storeEmployeeRelationsEntities(data.data)
    }
    DecLoading()
  }

  async function deleteOne(id: number) {
    IncLoading()
    await $api().delete(`employee/${id}`)
    employeeStore.deleteOneEmployee(id)
    $toast.success('Destinataire supprimé avec succès')
    DecLoading()
  }

  async function patchOne(id: number, payload: EmployeeType) {
    IncLoading()
    const { data } = await $api().patch<EmployeeType>(`employee/${id}`, payload)
    if (data && isEmployeeType(data)) {
      employeeStore.updateOne(id, data)
      $toast.success('Destinataire modifié avec succès')
    }
    DecLoading()
  }

  async function postOne(employee: EmployeeType, address: AddressType) {
    const { data } = await $api().post<EmployeeType>('employee', { employee, address })

    if (data && isEmployeeType(data)) {
      const company = companyStore.getAuthCompany
      if (company) {
        companyStore.updateOneCompany(company.id, {
          employeeIds: [...company.employeeIds, data.id],
        })
      }
      employeeStore.addMany([data])
      $toast.success('Destinataire créé avec succès')
      return data
    }
    return null
  }

  async function postManyForEvent(employees: EmployeeType[], eventId: number, userId: number) {
    IncLoading()
    const { data } = await $api().post<EmployeeType[]>(`employee/manyonevent/${eventId}/${userId}`, employees)

    if (data && areEmployeeTypes(data)) {
      const company = companyStore.getAuthCompany
      if (company) {
        companyStore.updateOneCompany(company.id, {
          employeeIds: [...company.employeeIds, ...data.map(emp => emp.id)],
        })
      }
      employeeStore.addMany(data)
      $toast.success('Destinataires créés avec succès')
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

  function filteredEmployees(list: EmployeeType[], query: Ref<string>): EmployeeType[] {
    return query.value === ''
      ? list
      : list.filter(person =>
        person.lastName
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.value.toLowerCase().replace(/\s+/g, ''))
        || person.firstName
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.value.toLowerCase().replace(/\s+/g, '')),
      )
  }

  async function postOneAdminForUser(
    { employee, address, userId }: { employee: EmployeeType; address: AddressType; userId: number }) {
    const { data } = await $api().post<EmployeeType>('admin/employee', { employee, address, userId })

    if (data && isEmployeeType(data)) {
      employeeStore.addMany([data])
      $toast.success('Destinataire créé avec succès')
    }
    return null
  }

  return {
    areEmployeeTypes,
    deleteOne,
    fetchAll,
    fetchAllByUserId,
    fetchOne,
    fetchMany,
    getEmployeeFullname,
    fetchEmployeesByEventId,
    filteredEmployees,
    getEmployeeStatusColor,
    getEmployeeStatusSignature,
    patchOne,
    postManyForEvent,
    postOne,
    postOneAdminForUser,
    storeEmployeeRelationsEntities,
  }
}
