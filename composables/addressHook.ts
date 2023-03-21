import { hasOwnProperty } from '@antfu/utils'
import type { AddressPostPayload, AddressType, WithoutId } from '@/types'
import { useAddressStore, useUiStore } from '~~/store'

export default function addressHook() {
  const { $toast, $api } = useNuxtApp()

  const { IncLoading, DecLoading } = useUiStore()
  const addressStore = useAddressStore()
  const { updateOneAddress, addOne, addMany } = addressStore

  async function fetchOne(id: number) {
    IncLoading()
    try {
      const { data: address } = await $api().get<AddressType>(`address/${id}`)
      if (address) {
        addOne(address)
      }
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
    DecLoading()
  }

  async function fetchMany(ids: number[]) {
    IncLoading()
    try {
      if (ids.length > 0) {
        const { data } = await $api().get<AddressType[]>(`address/manyByIds?ids=${ids.join(',')}`)

        if (data && data.length > 0) {
          addMany(data)
        }
      }
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
    DecLoading()
  }

  async function postOne(payload: AddressPostPayload) {
    IncLoading()
    try {
      const { data: address } = await $api().post<AddressType>('address/', payload as unknown as WithoutId<AddressType>)
      if (address) {
        addOne(address)
      }
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
    DecLoading()
  }

  async function patchOne(id: number, payload: Partial<AddressType>) {
    IncLoading()
    try {
      const { data: address } = await $api().patch<AddressType>(`address/${id}`, { address: payload })
      if (isAddressType(address)) {
        updateOneAddress(id, address)
        $toast.success('Adresse mise à jours')
      }
    } catch (error) {
      console.error(error)
      $toast.error('Une erreur est survenue')
    }
    DecLoading()
  }

  function isAddressType(arg: any): arg is AddressType {
    return hasOwnProperty(arg, 'addressLine')
      && hasOwnProperty(arg, 'postalCode')
      && hasOwnProperty(arg, 'city')
      && hasOwnProperty(arg, 'country')
  }

  return {
    fetchOne,
    fetchMany,
    isAddressType,
    patchOne,
    postOne,
  }
}
