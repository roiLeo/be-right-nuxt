import { hasOwnProperty } from '@antfu/utils'
import type { NuxtError } from 'nuxt/app'

enum FetchMethods {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'PATCH',
  DELETE = 'delete',
}

interface ApiMethods {
  setCredentials: (token: string) => void
  deleteCredentials: () => void
  get: <T>(path: string) => Promise<FetchWrapperResponse<T>>
  post: <T>(path: string, data?: any) => Promise<FetchWrapperResponse<T>>
  patch: <T>(path: string, data: any) => Promise<FetchWrapperResponse<T>>
  put: <T>(path: string, data: any) => Promise<FetchWrapperResponse<T>>
  delete: <T>(path: string, data?: any) => Promise<FetchWrapperResponse<T>>
}

interface FetchWrapperResponse<T> {
  success: boolean
  status: number
  data: T | null
  statusText: string
}

interface HeadersInterface extends Headers { }

interface ResponseError {
  error: {
    status: number
    message: string
    stackTrace: string
  }
}

interface FetchWrapperInit {
  baseUrl: string
  headers?: HeadersInterface
  token?: string
  redirect?: RequestRedirect
}

export class FetchWrapper implements ApiMethods {
  private baseUrl: string
  private headers?: Headers
  private redirect?: RequestRedirect = 'follow'
  public token?: string

  constructor(init: FetchWrapperInit) {
    this.baseUrl = init.baseUrl
    this.token = init.token
    this.headers = init.headers
    this.redirect = init.redirect
  }

  setCredentials(token: string) {
    this.token = token
  }

  deleteCredentials() {
    this.token = undefined
  }

  private buildBody(body: BodyInit | null | undefined, isFileRequest?: boolean) {
    if (!body) {
      return null
    }
    if (isFileRequest) {
      return body
    }
    return JSON.stringify(body)
  }

  private buildHeaders(headersInit: HeadersInit | undefined, isFileRequest?: boolean) {
    if (isFileRequest) {
      return new Headers({
        ...headersInit,
        Accept: 'application/json',
        Authorization: `Bearer ${this.token ? this.token : ''}`,
      })
    }
    return new Headers({
      ...headersInit,
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token ? this.token : ''}`,
      'Content-type': 'application/json; charset=UTF-8',
    })
  }

  private isError(obj: any): obj is ResponseError {
    return hasOwnProperty(obj, 'error')
      && hasOwnProperty(obj.error, 'status')
      && hasOwnProperty(obj.error, 'message')
  }

  private async http<T>(url: string, config: RequestInit, isFileRequest?: boolean): Promise<FetchWrapperResponse<T>> {
    const { $toast } = useNuxtApp()
    try {
      const request = new Request(url, {
        ...config,
        headers: this.buildHeaders(config.headers, isFileRequest),
        body: this.buildBody(config.body, isFileRequest),
      })

      const response = await fetch(request)

      let data = null

      if (config.method !== FetchMethods.DELETE) {
        data = await response.json() as unknown as T
      }

      if (this.isError(data)) {
        const { status, message } = data.error
        throw createError({ statusCode: status, statusMessage: message })
      }

      return {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data,
      }
    } catch (err: unknown) {
      if (err) {
        const error = err as NuxtError

        const { message, statusCode } = error
        $toast?.danger(message)
        return {
          success: false,
          status: statusCode,
          statusText: message,
          data: null,
        }
      }

      $toast.danger('Une erreur est survenue')

      return {
        success: false,
        status: 500,
        statusText: 'Une erreur est survenue',
        data: null,
      }
    }
  }

  private getPath(path: string): string {
    return `${this.baseUrl}${path}`
  }

  async get<T>(path: string): Promise<FetchWrapperResponse<T>> {
    return this.http<T>(this.getPath(path), {
      method: FetchMethods.GET,
    })
  }

  async post<T>(path: string, data?: any, isFileRequest?: boolean): Promise<FetchWrapperResponse<T>> {
    return this.http<T>(this.getPath(path), {
      method: FetchMethods.POST,
      body: data,
    }, isFileRequest)
  }

  async patch<T>(path: string, data: any): Promise<FetchWrapperResponse<T>> {
    return this.http<T>(this.getPath(path), {
      method: FetchMethods.PATCH,
      body: data,
    })
  }

  async put<T>(path: string, data: any): Promise<FetchWrapperResponse<T>> {
    return this.http<T>(this.getPath(path), {
      method: FetchMethods.PUT,
      body: data,
    })
  }

  async delete<T>(path: string): Promise<FetchWrapperResponse<T>> {
    return this.http(this.getPath(path), {
      method: FetchMethods.DELETE,
    })
  }
}
