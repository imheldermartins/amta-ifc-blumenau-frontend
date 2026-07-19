import { apiService } from '@/services/ApiService'

/**
 * `GET /workspaces/:id`.
 *
 * Só os campos que o app consome (mesma economia do `ApiPage` em
 * `@/lib/databaseParser`) — a resposta ainda traz `created_at`/`updated_at`,
 * que hoje ninguém lê.
 *
 * `name` é anulável no backend (`Schema.Workspace`): workspace sem nome é
 * possível, então quem exibe precisa de um fallback.
 */
export interface ApiWorkspace {
  id: string
  name: string | null
  data: Record<string, unknown> | null
}

/**
 * Leitura da workspace em si — a entidade, não a árvore de páginas dela.
 *
 * Fronteira com o `DatabaseService`: lá é o CONTEÚDO (a página de entrada e as
 * filhas, via `/workspaces/:id/page_root`); aqui é a IDENTIDADE (nome e `data`
 * da workspace), que é o que a barra superior mostra e o que o seletor de
 * workspaces vai listar.
 */
export class WorkspaceService {
  getWorkspace(workspaceId: string): Promise<ApiWorkspace> {
    return apiService.get<ApiWorkspace>(`/workspaces/${workspaceId}`)
  }
}

export const workspaceService = new WorkspaceService()
