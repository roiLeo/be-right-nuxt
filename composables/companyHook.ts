import type { Company, CreateNewUserPayload, UserType } from '~~/store'
import {
  useAddressStore,
  useCompanyStore,
  useEventStore,
  useFileStore,
  useSubscriptionStore,
  useUiStore,
  useUserStore,
} from '~~/store'

export default function userHook() {
  const { $toast, $api } = useNuxtApp()

  const addressStore = useAddressStore()
  const eventStore = useEventStore()
  const fileStore = useFileStore()
  const userStore = useUserStore()
  const companyStore = useCompanyStore()
  const { addOne: addCompany } = companyStore
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

    addCompany(company)
  }

  async function fetchOne(companyId: number) {
    try {
      IncLoading()
      const { data: company } = await $api().get<Company>(`company/${companyId}`)

      if (company) {
        storeCompanyEntities(company)
      }
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
  }

  async function addOrRemoveOwner(userId: number) {
    try {
      IncLoading()
      const { data } = await $api().patch<{ user: UserType; company: Company }>(`company/owners/${userId}`, {})

      if (data) {
        const { user, company } = data
        if (company) {
          storeCompanyEntities(company)
          userStore.updateOneUser(user.id, user)
        }
      }
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
    DecLoading()
  }

  async function createNewUser(payload: CreateNewUserPayload) {
    try {
      IncLoading()
      const { data } = await $api().post<{ user: UserType; company: Company }>('user', payload)

      if (data) {
        const { user, company } = data
        if (user) {
          userStore.addOne(user)
          companyStore.updateOneCompany(company.id, company)
        }
      }
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
    DecLoading()
  }

  return {
    addOrRemoveOwner,
    createNewUser,
    fetchOne,
    storeCompanyEntities,
  }
}
