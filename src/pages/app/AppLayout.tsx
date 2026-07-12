import { Outlet, useNavigate, useParams } from '@tanstack/react-router'

import { Button } from '@components/Button'
import { ThemeToggle } from '@components/ThemeToggle'
import { Typography } from '@components/Typography'
import { useAuth } from '@contexts/AuthContext'
import { i18n } from '@/lib/i18n'

/**
 * Casca da área autenticada (/app). As rotas filhas renderizam no <Outlet />.
 * A sidebar entra aqui futuramente (fora de escopo por enquanto).
 */
export function AppLayout() {
  const { lang } = useParams({ from: '/$lang/app' })
  const navigate = useNavigate()
  const auth = useAuth()

  function handleSignOut() {
    auth.signOut()
    void navigate({ to: '/$lang/sign-in', params: { lang } })
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between border-b border-divider bg-contrast px-6 py-3">
        <Typography variant="h3" as="span">
          {i18n('common.app-name')}
        </Typography>
        <div className="flex items-center gap-4">
          <Typography variant="subtitle" as="span">
            {auth.user?.name ?? auth.user?.email}
          </Typography>
          <ThemeToggle />
          <Button variant="outlined" color="red" onClick={handleSignOut}>
            {i18n('common.sair')}
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
