import type { Badge } from '~~/store'
import { useBadgeStore, useUiStore } from '~~/store'

export default function addressHook() {
  const { $toast, $api } = useNuxtApp()

  const { IncLoading, DecLoading } = useUiStore()
  const badgeStore = useBadgeStore()
  const { addMany } = badgeStore

  async function fetchAll() {
    IncLoading()
    try {
      const { data: badges } = await $api().get<Badge[]>('badges')
      if (badges) {
        addMany(badges.filter(badge => !badgeStore.isAlreadyInStore(badge.id)))
      }
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
    DecLoading()
  }

  return {
    fetchAll,
  }
}
