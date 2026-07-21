import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { ThemeToggle } from '@components/ThemeToggle'
import { DEFAULT_WORKSPACE_ID } from '@/contexts/WorkspaceContext'
import { authService } from '@/services/AuthService'

/**
 * Layout público (pathless): agrupa sign-in/sign-up. Usuário já autenticado
 * não tem o que fazer aqui — vai direto para a workspace padrão.
 */
export const Route = createFileRoute('/$lang/_public')({
  beforeLoad: ({ params }) => {
    if (authService.getStoredUser()) {
      throw redirect({
        to: '/$lang/myworkspace/$workspaceId',
        params: { lang: params.lang, workspaceId: DEFAULT_WORKSPACE_ID },
      })
    }
  },
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <>
      <ThemeToggle className="fixed right-4 top-4 z-50" />
      <Outlet />
    </>
  )
}
