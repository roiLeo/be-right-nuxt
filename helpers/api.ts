enum FetchMethods {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
}

type WithoutId<T> = Omit<T, 'id'>

interface ApiMethods {
  get: <T>(path: string) => Promise<FetchWrapperResponse<T>>
  post: <T>(path: string, data?: T) => Promise<FetchWrapperResponse<T>>
  patch: <T>(path: string, data: Partial<T>) => Promise<FetchWrapperResponse<T>>
  put: <T>(path: string, data: Partial<T>) => Promise<FetchWrapperResponse<T>>
  delete: <T>(path: string, data?: T) => Promise<FetchWrapperResponse<T>>
}

interface FetchWrapperResponse<T> {
  success: boolean
  status: number
  data: T | null
  statusText: string
}

interface HeadersInterface extends Headers { }

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

  private async http<T>(url: string, config: RequestInit): Promise<FetchWrapperResponse<T>> {
    const request = new Request(url, {
      ...config,
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${this.token ? this.token : ''}`,
        ...config.headers,
      },
      body: config.body ? JSON.stringify(config.body) : null,
    })
    const response = await fetch(request)

    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: config.method === FetchMethods.DELETE ? null : await response.json() as unknown as T,
    }
  }

  private getPath(path: string): string {
    return `${this.baseUrl}/${path}`
  }

  async get<T>(path: string): Promise<FetchWrapperResponse<T>> {
    return this.http<T>(this.getPath(path), {
      method: FetchMethods.GET,
    })
  }

  async post<T>(path: string, data?: WithoutId<T>): Promise<FetchWrapperResponse<T>> {
    return this.http<T>(this.getPath(path), {
      method: FetchMethods.POST,
      body: data,
    })
  }

  async patch<T>(path: string, data: Partial<T>): Promise<FetchWrapperResponse<T>> {
    return this.http<T>(this.getPath(path), {
      method: FetchMethods.PATCH,
      body: data,
    })
  }

  async put<T>(path: string, data: Partial<T>): Promise<FetchWrapperResponse<T>> {
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
