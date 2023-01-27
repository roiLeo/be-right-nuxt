import { hasOwnProperty } from '@antfu/utils'
import type { AddressPostPayload, AddressType, WithoutId } from '@/types'
import { useAddressStore, useUiStore } from '~~/store'

export default function addressHook() {
  const { $toast, $api } = useNuxtApp()

  const { IncLoading, DecLoading } = useUiStore()
  const { createOne, updateOne, addOne } = useAddressStore()

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

  async function postOne(payload: AddressPostPayload) {
    IncLoading()
    try {
      const { data: address } = await $api().post<AddressType>('address/', payload as unknown as WithoutId<AddressType>)
      if (address) {
        createOne(address)
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
      const { data: address } = await $api().patch<AddressType>(`address/${id}`, payload)
      if (isAddressType(address)) {
        updateOne(id, address)
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
    isAddressType,
    patchOne,
    postOne,
  }
}
