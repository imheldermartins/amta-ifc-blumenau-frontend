import { createFileRoute, redirect } from '@tanstack/react-router'

import { WorkspaceProvider } from '@/contexts/WorkspaceContext'
import { AppLayout } from '@/pages/app/AppLayout'
import { authService } from '@/services/AuthService'

/** Área privada: exige autenticação; sem sessão, volta para o sign-in. */
export const Route = createFileRoute('/$lang/myworkspace/$workspaceId')({
  beforeLoad: ({ params }) => {
    if (!authService.getStoredUser()) {
      throw redirect({ to: '/$lang/sign-in', params: { lang: params.lang } })
    }
  },
  component: AppRoute,
})

/**
 * O `WorkspaceProvider` entra aqui, e não no `main.tsx`, por dois motivos: o
 * fetch da workspace só faz sentido na área privada (o `beforeLoad` acima já
 * garantiu a sessão, então a chamada nunca sai sem token), e o provider morre
 * junto com a rota — sair do app e voltar recarrega a workspace.
 *
 * A workspace em foco é o PARÂMETRO DA URL, não uma constante. O `key` força a
 * remontagem do provider quando o id muda: sem ele, o estado da workspace
 * anterior (nome, flags de loading) sobreviveria à troca.
 */
function AppRoute() {
  const { workspaceId } = Route.useParams()

  return (
    <WorkspaceProvider key={workspaceId} workspaceId={workspaceId}>
      <AppLayout />
    </WorkspaceProvider>
  )
}
