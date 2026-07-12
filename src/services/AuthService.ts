import { AppError } from '@/lib/errors'
import { apiService } from '@/services/ApiService'
import { tokenStore, type Tokens } from '@/services/tokenStore'

export interface AuthUser {
  /** ULID gerado pelo backend. */
  id: string
  name: string | null
  email: string
}

export interface SignUpInput {
  name: string
  email: string
  password: string
}

export interface SignInInput {
  email: string
  password: string
}

export class EmailInUseError extends Error {}
export class InvalidCredentialsError extends Error {}

const USER_KEY = 'cubs.auth.user'

interface RegisterResponse {
  user: AuthUser
  tokens: Tokens
}

// O ApiService rejeita sempre AppError — o status HTTP já vem normalizado.
function hasStatus(error: unknown, status: number): boolean {
  return error instanceof AppError && error.status === status
}

/**
 * Autenticação contra a API do Cub's (backend Express, rotas `/auth`).
 *
 * O backend cuida do hash (bcrypt) e emite um par JWT. Aqui só guardamos os
 * tokens (via tokenStore) e o usuário sanitizado (localStorage), para o guard
 * das rotas e o header do app saberem que há sessão.
 */
export class AuthService {
  async signUp(input: SignUpInput): Promise<AuthUser> {
    try {
      const { user, tokens } = await apiService.post<RegisterResponse>('/auth/register', {
        name: input.name.trim() || null,
        email: input.email.trim().toLowerCase(),
        password: input.password,
      })
      tokenStore.set(tokens)
      this.persistUser(user)
      return user
    } catch (error) {
      if (hasStatus(error, 409)) {
        throw new EmailInUseError()
      }
      throw error
    }
  }

  async signIn(input: SignInInput): Promise<AuthUser> {
    let tokens: Tokens
    try {
      tokens = await apiService.post<Tokens>('/auth/login', {
        email: input.email.trim().toLowerCase(),
        password: input.password,
      })
    } catch (error) {
      if (hasStatus(error, 401)) {
        throw new InvalidCredentialsError()
      }
      throw error
    }

    tokenStore.set(tokens)
    // /auth/login devolve só os tokens; o usuário vem de GET /users, que o
    // backend escopa ao token (retorna apenas o próprio usuário autenticado).
    const [user] = await apiService.get<AuthUser[]>('/users')
    if (!user) {
      tokenStore.clear()
      throw new InvalidCredentialsError()
    }
    this.persistUser(user)
    return user
  }

  signOut(): void {
    tokenStore.clear()
    localStorage.removeItem(USER_KEY)
  }

  getStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as AuthUser
    } catch {
      localStorage.removeItem(USER_KEY)
      return null
    }
  }

  private persistUser(user: AuthUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

export const authService = new AuthService()
