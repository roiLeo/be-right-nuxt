import { hasOwnProperty, uniq } from '@antfu/utils'
import type { Company, CreateNewUserPayload, MissingInfos, UserType } from '~~/store'
import {
  useAddressStore,
  useCompanyStore,
  useEventStore,
  useFileStore,
  useSubscriptionStore,
  useUiStore,
  useUserStore,
} from '~~/store'

export default function companyHook() {
  const { $toast, $api } = useNuxtApp()

  const addressStore = useAddressStore()
  const eventStore = useEventStore()
  const fileStore = useFileStore()
  const userStore = useUserStore()
  const companyStore = useCompanyStore()
  const { addOne: addCompany, updateOneCompany } = companyStore
  const subscriptionStore = useSubscriptionStore()
  const { IncLoading, DecLoading } = useUiStore()
  const { storeEmployeeRelationsEntities } = employeeHook()

  /**
   * function to store all objetcs or arrays company's entities
   * @param company
   * @param isUserToSetCurrent
   */
  function storeCompanyEntities(company: Company) {
    if (company.events && company.events.length > 0) {
      const userEvents = company.events
      const eventsToStore = userEvents.filter(event => !eventStore.isAlreadyInStore(event.id))
      eventStore.addMany(eventsToStore)
    }

    if (company.address && !addressStore.isAlreadyInStore(company.address.id)) {
      addressStore.addOne(company.address)
    }

    if (company.employees && company.employees.length > 0 && !isArrayOfNumbers(company.employees)) {
      storeEmployeeRelationsEntities(company.employees)
    }

    if (company.files && company.files.length > 0 && !isArrayOfNumbers(company.files)) {
      const files = company.files
      const filesToStore = files.filter(file => !fileStore.isAlreadyInStore(file.id))
      fileStore.createMany(filesToStore)
    }

    if (company.subscription && !subscriptionStore.isAlreadyInStore(company.subscriptionId)) {
      subscriptionStore.addMany([company.subscription])
    }

    if (company.users && company.users.length > 0) {
      const missingUsers = company.users.filter(user => !userStore.isAlreadyInStore(user.id))
      if (missingUsers.length > 0) {
        userStore.addMany(missingUsers)
      }
    }

    if (companyStore.isAlreadyInStore(company.id)) {
      updateOneCompany(company.id, company)
    } else {
      addCompany(company)
    }
  }

  function isCompanyType(arg: any): arg is Company {
    return hasOwnProperty(arg, 'subscriptionLabel')
      && hasOwnProperty(arg, 'siret')
      && hasOwnProperty(arg, 'name')
      && hasOwnProperty(arg, 'subscriptionId')
  }

  function areCompaniesTypes(args: unknown[]): args is Company[] {
    return args.every(arg => isCompanyType(arg))
  }

  async function fetchOne(companyId: number) {
    IncLoading()
    const { data: company } = await $api().get<Company>(`company/${companyId}`)

    if (company && isCompanyType(company)) {
      storeCompanyEntities(company)
    }
    DecLoading()
  }

  async function fetchMany(userIds: number[]) {
    IncLoading()
    if (userIds.length > 0) {
      const { data } = await $api().get<Company[]>(`company/manyByIds?ids=${uniq(userIds).join(',')}`)

      if (data && data.length > 0 && areCompaniesTypes(data)) {
        const missingCompanies = data.filter(user => !companyStore.isAlreadyInStore(user.id))

        if (missingCompanies.length > 0) {
          companyStore.addMany(missingCompanies)
        }
      }
    }
    DecLoading()
  }

  async function addOrRemoveOwner(userId: number) {
    IncLoading()
    const { data } = await $api().patch<{ user: UserType; company: Company }>(`company/owners/${userId}`, {})

    if (data) {
      const { user, company } = data
      if (company && isCompanyType(company)) {
        storeCompanyEntities(company)
        userStore.updateOneUser(user.id, user)
      }
    }
    DecLoading()
  }

  async function createNewUser(payload: CreateNewUserPayload) {
    IncLoading()
    const { data } = await $api().post<{ user: UserType; company: Company }>('user', payload)

    if (data) {
      const { user, company } = data
      if (user && isCompanyType(company)) {
        userStore.addOne(user)
        companyStore.updateOneCompany(company.id, company)
      }
    }
    DecLoading()
  }

  async function patchOne(companyId: number, company: Partial<Company>) {
    IncLoading()
    const { data } = await $api().patch<Company>(`company/${companyId}`, { company })
    if (isCompanyType(data)) {
      updateOneCompany(companyId, data)
      $toast.success('Entreprise mise à jours')
    }
    DecLoading()
  }

  const getMissingsInfos: ComputedRef<MissingInfos[]> = computed(() => {
    const currentUser = userStore.getAuthUser
    if (currentUser) {
      const missingInfos = []
      const currentCompany = companyStore.getOne(currentUser.companyId)
      if (currentCompany) {
        if (!currentCompany.addressId) {
          missingInfos.push({
            label: 'addresse de l\'entreprise',
            link: {
              name: 'mon-compte',
            },
          })
        }

        if (!currentCompany.siret) {
          missingInfos.push({
            label: 'Le siret de l\'entreprise',
            link: {
              name: 'mon-compte',
            },
          })
        }

        if (currentUser.notificationSubscriptionIds?.length < 1) {
          missingInfos.push({
            label: 'Configuration des notifications',
            link: {
              name: 'mon-compte-notifications',
            },
          })
        }

        if (currentCompany.employeeIds?.length === 0) {
          missingInfos.push({
            label: 'Créer vos premiers destinataires',
            link: {
              name: 'destinataire-create',
            },
          })
        }

        if (currentCompany.groupIds?.length === 0) {
          missingInfos.push({
            label: 'Créer vos premiers groupes de diffusions',
            link: {
              name: 'groupe-creation',
            },
          })
        }

        if (!currentUser.signature) {
          missingInfos.push({
            label: 'Créer votre signature par défault',
            link: {
              name: 'mon-compte',
            },
          })
        }
        return missingInfos
      }
      return []
    }
    return []
  })

  return {
    addOrRemoveOwner,
    createNewUser,
    fetchOne,
    fetchMany,
    getMissingsInfos,
    isCompanyType,
    patchOne,
    storeCompanyEntities,
  }
}
