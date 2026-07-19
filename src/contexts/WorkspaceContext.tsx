import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { workspaceService, type ApiWorkspace } from '@/services/WorkspaceService'

/**
 * Workspace em foco — FIXA por enquanto.
 *
 * "IFC Blumenau — Professores", do seed do backend: 3 colunas (E-mail/text,
 * Área/select, Ativo/checkbox) e 26 filhas (os docentes). O usuário logado
 * (admin@cubs.local) é o dono da página de entrada dela, que é o que a API
 * exige para ler/editar.
 *
 * TEMPORÁRIO: este id é o valor INICIAL de um estado que ainda não muda. Quando
 * existir o seletor de workspaces do usuário, ele vira só o padrão (ou some, se
 * a escolha vier da URL/preferência) e o provider ganha um `setWorkspaceId` —
 * nada fora daqui precisa mudar, porque todo consumidor já lê o id do contexto.
 */
export const FIXED_WORKSPACE_ID = '01KXDN4B182DJGAKPX0940H54N'

export interface WorkspaceState {
  /** Id da workspace em foco. Fonte única — nada deve reescrever a constante. */
  workspaceId: string
  /** Dados da workspace; `null` enquanto carrega ou se a leitura falhou. */
  workspace: ApiWorkspace | null
  loading: boolean
  failed: boolean
}

const WorkspaceContext = createContext<WorkspaceState | null>(null)

/**
 * Workspace atual, carregada uma vez por sessão aberta.
 *
 * O fetch acontece no mount do provider (que vive na rota `/$lang/app`, ou
 * seja: ao carregar o layout) e o resultado fica em memória — trocar de rota
 * dentro do app NÃO refaz a chamada; recarregar a página, sim.
 *
 * Só a IDENTIDADE da workspace mora aqui (nome e `data`). O conteúdo — a base,
 * as colunas, as linhas — continua sendo carregado por quem desenha a página,
 * via `DatabaseService`, a partir do `workspaceId` que este contexto fornece.
 */
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspace, setWorkspace] = useState<ApiWorkspace | null>(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  // O flag `active` descarta a resposta de um unmount no meio do caminho — sem
  // ele, o setState cai num componente que já saiu da árvore.
  useEffect(() => {
    let active = true

    workspaceService
      .getWorkspace(FIXED_WORKSPACE_ID)
      .then((loaded) => {
        if (active) setWorkspace(loaded)
      })
      // O ApiService já logou o AppError; aqui só marca a falha para a UI
      // cair no rótulo de fallback em vez de ficar em "Carregando..." eterno.
      .catch(() => {
        if (active) setFailed(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const value = useMemo<WorkspaceState>(
    () => ({ workspaceId: FIXED_WORKSPACE_ID, workspace, loading, failed }),
    [workspace, loading, failed],
  )

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export function useWorkspace(): WorkspaceState {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error('useWorkspace precisa ser usado dentro de <WorkspaceProvider>.')
  }
  return context
}
