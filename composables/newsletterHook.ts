import type { NewsletterType, PaginatedResponse } from '@/types'
import { useNewsletterStore, useUiStore } from '~~/store'

export default function newsletterHook() {
  const { $toast, $api } = useNuxtApp()
  const { IncLoading, DecLoading } = useUiStore()

  const newsletterStore = useNewsletterStore()
  const { createMany, deleteOne: deleteOneStore } = newsletterStore

  async function newsletterSignup({
    email,
    firstName,
    lastName,
    companyName,
  }:
  {
    email: string
    firstName: string | null
    lastName: string | null
    companyName: string | null
  }) {
    IncLoading()
    try {
      const res = await $api().post('newsletter/', { email, firstName, lastName, companyName })

      if (res.status === 200) {
        DecLoading()
        return res.status
      }
    } catch (error) {
      $toast.danger('Une erreur est survenue')
      console.error(error)
    }
    DecLoading()
  }

  async function fetchAll(url?: string) {
    IncLoading()
    try {
      let finalUrl = 'newsletter'
      if (url) {
        finalUrl += `${url}`
      }

      const { data: res } = await $api().get<PaginatedResponse<NewsletterType>>(finalUrl)
      if (res) {
        const { data }: PaginatedResponse<NewsletterType> = res
        const missingNewsletters = newsletterStore.getMissingEntities(data)
        if (missingNewsletters.length > 0) {
          createMany(missingNewsletters)
        }
      }
    } catch (error) {
      console.error(error)
      $toast.danger('Une erreur est survenue')
    }
    DecLoading()
  }

  async function deleteOne(id: number) {
    IncLoading()
    try {
      await $api().delete(`newsletter/${id}`)
      deleteOneStore(id)
      $toast.success('Newsletter item supprimé avec succès')
    } catch (error) {
      console.error(error)
      $toast.danger('Une erreur est survenue')
    }
    DecLoading()
  }

  return {
    deleteOne,
    fetchAll,
    newsletterSignup,
  }
}
