import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { ThemeToggle } from '@components/ThemeToggle'
import { authService } from '@/services/AuthService'

/**
 * Layout público (pathless): agrupa sign-in/sign-up. Usuário já autenticado
 * não tem o que fazer aqui — vai direto para /app.
 */
export const Route = createFileRoute('/$lang/_public')({
  beforeLoad: ({ params }) => {
    if (authService.getStoredUser()) {
      throw redirect({ to: '/$lang/app', params: { lang: params.lang } })
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
