/**
 * Persistência do par de tokens JWT (access 15m / refresh 7d) emitido pelo
 * backend. Fica isolado aqui para que ApiService e AuthService compartilhem
 * a mesma fonte sem dependência circular.
 */
export interface Tokens {
  accessToken: string
  refreshToken: string
}

const TOKENS_KEY = 'cubs.auth.tokens'

export const tokenStore = {
  get(): Tokens | null {
    const raw = localStorage.getItem(TOKENS_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as Tokens
    } catch {
      localStorage.removeItem(TOKENS_KEY)
      return null
    }
  },
  set(tokens: Tokens): void {
    localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens))
  },
  clear(): void {
    localStorage.removeItem(TOKENS_KEY)
  },
}
