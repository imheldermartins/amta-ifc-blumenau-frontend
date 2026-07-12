import axios from 'axios'

/**
 * Tratamento de erro padronizado do frontend.
 *
 * Todo erro que atravessa uma fronteira de serviço (API, socket, auth) vira
 * um `AppError` com `scope` + mensagem legível, e é logado num formato único:
 *
 *   [cubs:api] POST /auth/login → 401: Credenciais inválidas
 *   [cubs:socket] Falha ao conectar em http://localhost:5000: websocket error
 *
 * Assim o console conta a história inteira (quem falhou, onde e por quê) em
 * vez de um stack solto do axios/socket.io.
 */
export type ErrorScope = 'api' | 'socket' | 'auth' | 'app'

export class AppError extends Error {
  readonly scope: ErrorScope
  /** Status HTTP, quando a origem foi uma resposta da API. */
  readonly status?: number

  constructor(scope: ErrorScope, message: string, options?: { status?: number; cause?: unknown }) {
    super(message, { cause: options?.cause })
    this.name = 'AppError'
    this.scope = scope
    if (options?.status !== undefined) {
      this.status = options.status
    }
  }
}

/** Converte qualquer erro num AppError, extraindo o que der do axios. */
export function toAppError(scope: ErrorScope, error: unknown): AppError {
  if (error instanceof AppError) return error

  if (axios.isAxiosError(error)) {
    const method = error.config?.method?.toUpperCase() ?? 'HTTP'
    const url = error.config?.url ?? '?'
    const status = error.response?.status
    // Mensagem do backend ({ message }) tem prioridade sobre a do axios.
    const detail =
      (error.response?.data as { message?: string } | undefined)?.message ?? error.message

    return new AppError(scope, `${method} ${url} → ${status ?? 'sem resposta'}: ${detail}`, {
      ...(status !== undefined && { status }),
      cause: error,
    })
  }

  if (error instanceof Error) {
    return new AppError(scope, error.message, { cause: error })
  }
  return new AppError(scope, String(error))
}

/** Log padronizado: prefixo [cubs:<scope>] + mensagem (+ causa no debug). */
export function logError(error: AppError): void {
  console.error(`[cubs:${error.scope}] ${error.message}`, error.cause ?? '')
}

/** Atalho: normaliza, loga e devolve o AppError (para rethrow/reject). */
export function reportError(scope: ErrorScope, error: unknown): AppError {
  const appError = toAppError(scope, error)
  logError(appError)
  return appError
}
