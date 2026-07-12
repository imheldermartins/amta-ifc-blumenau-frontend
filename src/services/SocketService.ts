import { io, type Socket } from 'socket.io-client'

import { connection } from '@/lib/connection'
import { AppError, logError } from '@/lib/errors'
import { apiService } from '@/services/ApiService'
import { tokenStore } from '@/services/tokenStore'

/**
 * Contrato de eventos com o backend (espelha src/core/socket/socket-server.ts
 * do cubs-backend). Ao criar um evento novo, atualize os DOIS lados.
 */
export interface EchoReply {
  message: string
  userId: string
  at: string
}

export interface ServerToClientEvents {
  'presence:count': (count: number) => void
  'echo:reply': (payload: EchoReply) => void
}

export interface ClientToServerEvents {
  'echo:send': (message: string) => void
}

export type CubsSocket = Socket<ServerToClientEvents, ClientToServerEvents>

/**
 * Conexão socket.io do Cub's — MESMO servidor da API HTTP (a URL vem de
 * `src/lib/connection.ts`; o socket herda a origem da API a menos que
 * `VITE_CUBS_SOCKET_URL` diga o contrário).
 *
 * Autenticação: o handshake envia `auth.token` com o mesmo JWT das rotas
 * HTTP, relido do tokenStore a CADA tentativa (reconexões usam o token já
 * renovado pelo ApiService).
 *
 * Erros de conexão são logados no formato padrão do projeto
 * (`[cubs:socket] ...`), uma vez por causa distinta — sem spam de retry.
 *
 * Ciclo de vida por contagem de consumidores: `acquire()` no mount,
 * `release()` no unmount (o hook useSocket faz isso) — desconecta sozinho
 * quando o último consumidor sai.
 */
export class SocketService {
  private socket: CubsSocket | null = null
  private consumers = 0
  private lastErrorMessage: string | null = null
  private triedAuthRefresh = false

  acquire(): CubsSocket {
    this.consumers += 1

    if (!this.socket) {
      const options = {
        transports: ['websocket'] as string[],
        // Forma de função: reavaliada a cada (re)conexão, token sempre atual.
        auth: (setAuth: (data: object) => void) => {
          setAuth({ token: tokenStore.get()?.accessToken })
        },
      }
      this.socket = connection.socketUrl ? io(connection.socketUrl, options) : io(options)
      this.attachLogging(this.socket)
    } else if (this.socket.disconnected) {
      this.socket.connect()
    }

    return this.socket
  }

  release(): void {
    this.consumers = Math.max(0, this.consumers - 1)
    if (this.consumers === 0) {
      this.socket?.disconnect()
    }
  }

  private attachLogging(socket: CubsSocket): void {
    const target = connection.socketUrl ?? `${window.location.origin} (proxy /socket.io)`

    socket.on('connect_error', (error) => {
      // Loga só quando a causa muda — retries repetem o mesmo erro.
      if (error.message !== this.lastErrorMessage) {
        this.lastErrorMessage = error.message
        logError(
          new AppError(
            'socket',
            `Falha ao conectar em ${target}: ${error.message}. ` +
              'Verifique se o backend está de pé e as envs VITE_CUBS_API_URL / VITE_CUBS_SOCKET_URL.',
            { cause: error },
          ),
        )
      }

      // "Não autorizado" = handshake recusado pelo backend (access token
      // expirado/inválido). O socket.io NÃO re-tenta recusas do servidor,
      // então renovamos o par via API e reconectamos manualmente (uma vez;
      // o flag evita loop caso a recusa persista).
      if (error.message === 'Não autorizado' && !this.triedAuthRefresh) {
        this.triedAuthRefresh = true
        void apiService.refreshSession().then((refreshed) => {
          if (refreshed) {
            console.info('[cubs:socket] Access token renovado — reconectando...')
            socket.connect()
          }
        })
      }
    })

    socket.on('connect', () => {
      if (this.lastErrorMessage !== null) {
        console.info(`[cubs:socket] Conectado a ${target} (recuperado de: ${this.lastErrorMessage})`)
      }
      this.lastErrorMessage = null
      this.triedAuthRefresh = false
    })
  }
}

export const socketService = new SocketService()
