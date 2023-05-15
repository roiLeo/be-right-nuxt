import { hasOwnProperty } from '@antfu/utils'
import { FileTypeEnum } from '@/types'
import type { FileType, PaginatedResponse, UserType } from '@/types'
import { useFileStore, useUiStore, useUserStore } from '~~/store'

export default function fileHook() {
  const { $toast, $api } = useNuxtApp()

  const { updateOne, setCurrent } = useUserStore()
  const userStore = useUserStore()
  const { getAllIds: getAllFilesIds } = useFileStore()
  const fileStore = useFileStore()
  const { IncLoading, DecLoading } = useUiStore()

  async function postOne(fileForm: FormData, id?: number) {
    try {
      const { data } = await $api().post<FileType>(`file/${id}`, fileForm)
      if (isFileType(data)) {
        fileStore.createOne(data)
        $toast.success('fichier créé avec succès')
      }
      return data
    } catch (error) {
      console.error(error)
      $toast.danger('Une erreur est survenue')
    }
  }

  async function postProfilePicture(fileForm: FormData) {
    const { isUserType } = userHook()
    IncLoading()
    try {
      const { data } = await $api().post<FileType>('file/profile', fileForm)
      if (data && isFileType(data)) {
        if (data.createdByUserId) {
          fileStore.createOne(data)
          const { data: user } = await $api().get<UserType>(`user/${data.createdByUserId}`)
          if (user && isUserType(user)) {
            updateOne(user.id, user)
            if (userStore.getAuthUserId === user.id) {
              setCurrent(user)
            }
          }
          $toast.success('Photo de profile créé avec succès')
        }
      }
    } catch (error) {
      console.error(error)
      $toast.danger('Une erreur est survenue')
    }
    DecLoading()
  }

  async function postLogo(fileForm: FormData) {
    IncLoading()
    try {
      const { data } = await $api().post<FileType>('file/logo', fileForm)
      if (data && data.createdByUserId && isFileType(data)) {
        fileStore.createOne(data)
        $toast.success('Logo créé avec succès')
      }
    } catch (error) {
      console.error(error)
      $toast.danger('Une erreur est survenue')
    }
    DecLoading()
  }

  function filteringFilesNotInStore(files: FileType[]) {
    if (files.length > 0) {
      return files.filter(file => !getAllFilesIds.includes(file.id))
    }
    return []
  }

  async function fetchAll(url?: string) {
    IncLoading()
    try {
      let finalUrl = 'file'
      if (url) {
        finalUrl += `${url}`
      }

      const { data } = await $api().get<PaginatedResponse<FileType>>(finalUrl)

      if (data) {
        const files = filteringFilesNotInStore(data.data)
        if (files.length > 0) {
          fileStore.createMany(files)
        }
      }
    } catch (error) {
      console.error(error)
      $toast.danger('Une erreur est survenue')
    }
    DecLoading()
  }

  function getTranslationFileType(fileType: FileTypeEnum) {
    switch (fileType) {
      case FileTypeEnum.LOGO:
        return 'Logo'
      case FileTypeEnum.MODEL:
        return 'Modèle'

      case FileTypeEnum.IMAGE_RIGHT:
        return 'Droit à l\'image'

      case FileTypeEnum.PROFILE_PICTURE:
        return 'Photo de profil'

      case FileTypeEnum.BUG_REPORT:
        return 'Capture d\'écran de bug'

      default:
        return 'Autre'
    }
  }

  async function deleteOne(id: number) {
    IncLoading()
    try {
      await $api().delete(`file/${id}`)
      fileStore.deleteOne(id)
      $toast.success('Fichier supprimé avec succès')
    } catch (error) {
      console.error(error)
      $toast.danger('Une erreur est survenue')
    }
    DecLoading()
  }

  async function patchOne(file: FileType) {
    IncLoading()
    try {
      const { data } = await $api().patch<FileType>(`file/${file.id}`, file)
      if (data && isFileType(data)) {
        fileStore.updateOne(data.id, data)
        $toast.success('fichier modifié avec succès')
      }
    } catch (error) {
      console.error(error)
      $toast.danger('Une erreur est survenue')
    }
    DecLoading()
  }

  function isNotPersonnalFile(file: FileType) {
    return ![FileTypeEnum.BUG_REPORT, FileTypeEnum.PROFILE_PICTURE, FileTypeEnum.LOGO].includes(file.type)
  }

  function isFileType(file: any): file is FileType {
    return hasOwnProperty(file, 'fileName')
  }

  async function fetchManyFiles(ids: number[]) {
    IncLoading()
    try {
      const { data } = await $api().get<PaginatedResponse<FileType>>(`file/many/?ids=${ids.join(',')}`)

      if (data) {
        const files = filteringFilesNotInStore(data.data)
        if (files.length > 0) {
          fileStore.createMany(files)
        }
      }
    } catch (error) {
      console.error(error)
      $toast.danger('Une erreur est survenue')
    }
    DecLoading()
  }

  return {
    deleteOne,
    fetchAll,
    fetchManyFiles,
    filteringFilesNotInStore,
    getTranslationFileType,
    isFileType,
    isNotPersonnalFile,
    patchOne,
    postLogo,
    postOne,
    postProfilePicture,
  }
}
