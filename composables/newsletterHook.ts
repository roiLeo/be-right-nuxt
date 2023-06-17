import { useNewsletterStore, useUiStore } from '~~/store'

export default function newsletterHook() {
  const { $toast, $api } = useNuxtApp()
  const { IncLoading, DecLoading } = useUiStore()

  const newsletterStore = useNewsletterStore()
  const { deleteOne: deleteOneStore } = newsletterStore

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
    const res = await $api().post('newsletter/', { email, firstName, lastName, companyName })

    if (res.status === 200) {
      DecLoading()
      return res.status
    }
    DecLoading()
  }

  async function deleteOne(id: number) {
    IncLoading()
    await $api().delete(`newsletter/${id}`)
    deleteOneStore(id)
    $toast?.success('Newsletter item supprimé avec succès')
    DecLoading()
  }

  return {
    deleteOne,
    newsletterSignup,
  }
}
