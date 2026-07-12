/**
 * Ponto único de configuração das conexões com o backend do Cub's.
 *
 * IMPORTANTE: a API HTTP e o socket.io são o MESMO servidor — o socket.io
 * "pega carona" no http.Server do express (mesma origem, mesma porta). O que
 * muda é o protocolo da conversa:
 *
 *   - API:    requisições HTTP normais (axios) em http://host:porta/...
 *   - Socket: o handshake começa em HTTP e sofre upgrade para WebSocket no
 *     caminho /socket.io. Por isso a URL do socket.io usa esquema http(s)://
 *     — o upgrade para ws:// acontece por dentro (o client até aceita ws://
 *     e normaliza, mas o canônico é http).
 *
 * Resolução (em ordem):
 *   1. `VITE_CUBS_SOCKET_URL` — só defina se um dia o socket morar em OUTRO
 *      servidor que não o da API (hoje não é o caso).
 *   2. `VITE_CUBS_API_URL` — origem do backend; o socket herda daqui.
 *   3. Sem env nenhuma (dev): tudo passa pelo proxy do Vite — a API em
 *      `/api/...` e o socket na própria origem (`/socket.io`), ambos
 *      repassados para o backend (ver `vite.config.ts`).
 */
const apiUrl = import.meta.env.VITE_CUBS_API_URL
const socketUrl = import.meta.env.VITE_CUBS_SOCKET_URL

export const connection = {
  /** Base URL do axios. Sem env, usa o path proxiado pelo Vite. */
  apiBaseUrl: apiUrl ?? '/api',
  /**
   * URL do socket.io. `undefined` = conectar na própria origem da página
   * (o proxy do Vite repassa /socket.io para o backend em dev).
   */
  socketUrl: socketUrl ?? apiUrl,
} as const
