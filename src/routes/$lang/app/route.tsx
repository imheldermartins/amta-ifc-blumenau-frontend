import { createFileRoute, redirect } from '@tanstack/react-router'

import { WorkspaceProvider } from '@/contexts/WorkspaceContext'
import { AppLayout } from '@/pages/app/AppLayout'
import { authService } from '@/services/AuthService'

/** Área privada: exige autenticação; sem sessão, volta para o sign-in. */
export const Route = createFileRoute('/$lang/app')({
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
 */
function AppRoute() {
  return (
    <WorkspaceProvider>
      <AppLayout />
    </WorkspaceProvider>
  )
}
