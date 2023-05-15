// import type { BugReportType, BugReportTypeEnum, PaginatedResponse } from '@/types'
// import { BugReportTypeTranslation } from '@/types'
// import { useBugStore, useUiStore } from '~~/store'

export default function bugReportsHook() {
  // const { $toast, $api } = useNuxtApp()

  // const bugStore = useBugStore()
  // const { IncLoading, DecLoading } = useUiStore()

  // async function fetchAll(url?: string) {
  //   IncLoading()
  //   try {
  //     let finalUrl = 'bugreport'
  //     if (url) {
  //       finalUrl += `${url}`
  //     }
  //     const { data } = await $api().get<PaginatedResponse<BugReportType>>(finalUrl)
  //     if (data) {
  //       const bugs = data.data.filter(bug => !bugStore.isAlreadyInStore(bug.id))
  //       if (bugs.length > 0) {
  //         bugStore.createMany(bugs)
  //       }
  //     }
  //   } catch (error) {
  //     console.error(error)
  //     $toast.danger('Une erreur est survenue')
  //   }
  //   DecLoading()
  // }

  // function getBugReportTypeTranslation(type: BugReportTypeEnum) {
  //   return BugReportTypeTranslation[type]
  // }

  // async function postOne(bugReport: Partial<BugReportType>) {
  //   try {
  //     const { data } = await $api().post<BugReportType>('bugreport', { bugReport })

  //     if (data) {
  //       bugStore.createOne(data)
  //     }
  //     $toast.success('Le rapport de bug a bien été envoyé')
  //     return data
  //   } catch (error) {
  //     console.error(error)
  //     $toast.danger('Une erreur est survenue')
  //   }
  // }

  return {
    // fetchAll,
    // getBugReportTypeTranslation,
    // postOne,
  }
}
