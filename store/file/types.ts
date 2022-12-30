import type { State } from '@malolebrin/pinia-entity-store'
import type { BaseEntity } from '@/types/globals'

export interface FileType extends BaseEntity {
  name: string
  fileName: string
  mimeType: string
  size: number
  type: FileTypeEnum
  description: string | null
  public_id: string
  signature: string
  width: number
  height: number
  format: FileFormatEnum
  url: string
  secure_url: string
  original_filename: string
  event: number
  employee: number
  createdByUser: number
}

export type FileFormType = Omit<FileType, 'id' | 'createdAt' | 'updatedAt'>

export enum FileTypeEnum {
  MODEL = 'MODEL',
  IMAGE_RIGHT = 'IMAGE_RIGHT',
  LOGO = 'LOGO',
  BUG_REPORT = 'BUG_REPORT',
  PROFILE_PICTURE = 'PROFILE_PICTURE',
}

export const fileTypeArray = Object.values(FileTypeEnum)

export enum FileFormatEnum {
  PDF = 'pdf',
  PNG = 'png',
}

export interface FileState extends State<FileType> { }
