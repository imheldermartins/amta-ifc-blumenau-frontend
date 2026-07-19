/**
 * Prefixo de path da API — REAL nos dois lados.
 *
 * O backend monta TODOS os routers sob `/api` (`API_PREFIX` em
 * `cubs-backend/src/core/http/http-server.ts`): `/api/auth`, `/api/users`,
 * `/api/pages`, `/api/workspaces`. Os mediadores no caminho repassam o path
 * INTACTO, sem reescrever:
 *
 *   dev   → proxy do Vite     (`vite.config.ts`)
 *   prod  → nginx do container (`nginx/nginx.conf`)
 *
 * O prefixo também serve para o mediador separar "isto é chamada de API" de
 * "isto é rota da SPA" na mesma origem — mas ele NÃO morre ali: segue até o
 * Express. Os services falam o path direto da rota (`/pages/:id`) porque quem
 * prende o prefixo é o `baseURL` do axios em `src/lib/connection.ts`, e esse
 * baseURL termina em `/api` mesmo quando `VITE_CUBS_API_URL` aponta direto
 * para o backend (sem mediador, o prefixo continua sendo do backend).
 *
 * ATENÇÃO: `nginx/nginx.conf` repete este valor na mão (arquivo de config não
 * importa TS). Mudou aqui, mude lá — são os dois lados do mesmo acordo.
 */
export const API_BASE_PATH = '/api'
