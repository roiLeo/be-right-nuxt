function isDev(env: string | undefined): boolean {
  return noUndefined(env) && noNull(env) && env === 'dev'
}

function isProd(env: string | undefined): boolean {
  return noUndefined(env) && noNull(env) && env === 'production'
}

export function getApiUrl(): string | null {
  let apiUrl: string | null = null

  const {
    NODE_ENV,
    VITE_MODE,
    VITE_DEV_API_URL,
    VITE_API_URL,
  } = import.meta.env

  if (!apiUrl) {
    if ((isDev(NODE_ENV?.toString()) || isDev(VITE_MODE?.toString())) && VITE_DEV_API_URL) {
      apiUrl = VITE_DEV_API_URL.toString()
    } else if ((isProd(NODE_ENV?.toString()) || isProd(VITE_MODE?.toString())) && VITE_API_URL) {
      apiUrl = VITE_API_URL.toString()
    }
  }

  return apiUrl
}
