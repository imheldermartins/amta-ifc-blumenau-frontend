import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'

import { connection } from '@/lib/connection'
import { reportError } from '@/lib/errors'
import { tokenStore, type Tokens } from '@/services/tokenStore'

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean
}

/**
 * Cliente HTTP da API do Cub's (backend Express).
 *
 * A origem vem de `src/lib/connection.ts` (env `VITE_CUBS_API_URL`, ou o
 * proxy `/api` do Vite em dev). O access token (JWT) é anexado em toda
 * requisição; num 401, tenta renovar o par de tokens uma única vez via
 * `POST /auth/refresh` e refaz a requisição original. O refresh é
 * "single-flight": vários 401 simultâneos aguardam a MESMA chamada de
 * refresh (evita rotacionar o refresh token N vezes em paralelo).
 *
 * Toda falha sai daqui como `AppError` (scope 'api'), já logada no formato
 * padrão do projeto — consumidores tratam `error.status`, não o axios cru.
 */
export class ApiService {
  private readonly http: AxiosInstance
  private refreshInFlight: Promise<Tokens> | null = null

  constructor() {
    this.http = axios.create({
      baseURL: connection.apiBaseUrl,
      timeout: 10_000,
    })

    this.http.interceptors.request.use((config) => {
      const tokens = tokenStore.get()
      if (tokens?.accessToken) {
        config.headers.Authorization = `Bearer ${tokens.accessToken}`
      }
      return config
    })

    this.http.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const original = error.config as RetriableConfig | undefined
        const tokens = tokenStore.get()
        const isRefreshCall = original?.url?.includes('/auth/refresh')

        if (
          error.response?.status === 401 &&
          original &&
          !original._retried &&
          tokens?.refreshToken &&
          !isRefreshCall
        ) {
          original._retried = true
          try {
            const refreshed = await this.refreshTokens(tokens.refreshToken)
            original.headers.Authorization = `Bearer ${refreshed.accessToken}`
            return this.http(original)
          } catch {
            tokenStore.clear()
          }
        }

        // Padroniza: loga uma vez e rejeita como AppError.
        return Promise.reject(reportError('api', error))
      },
    )
  }

  private refreshTokens(refreshToken: string): Promise<Tokens> {
    // Reaproveita o refresh em andamento, se houver (single-flight).
    this.refreshInFlight ??= this.http
      .post<Tokens>('/auth/refresh', { refreshToken })
      .then(({ data }) => {
        tokenStore.set(data)
        return data
      })
      .finally(() => {
        this.refreshInFlight = null
      })
    return this.refreshInFlight
  }

  /**
   * Força a renovação do par de tokens fora do fluxo de uma requisição —
   * usado pelo SocketService quando o handshake toma "Não autorizado"
   * (access token expirado). Compartilha o mesmo single-flight.
   */
  async refreshSession(): Promise<boolean> {
    const tokens = tokenStore.get()
    if (!tokens?.refreshToken) return false
    try {
      await this.refreshTokens(tokens.refreshToken)
      return true
    } catch {
      tokenStore.clear()
      return false
    }
  }

  get<T>(url: string): Promise<T> {
    return this.http.get<T>(url).then((response) => response.data)
  }

  post<T>(url: string, body?: unknown): Promise<T> {
    return this.http.post<T>(url, body).then((response) => response.data)
  }

  put<T>(url: string, body?: unknown): Promise<T> {
    return this.http.put<T>(url, body).then((response) => response.data)
  }

  delete<T>(url: string): Promise<T> {
    return this.http.delete<T>(url).then((response) => response.data)
  }
}

export const apiService = new ApiService()
