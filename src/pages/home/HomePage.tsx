import { useNavigate, useParams } from '@tanstack/react-router'

import { Button } from '@components/Button'
import { ThemeToggle } from '@components/ThemeToggle'
import { i18n } from '@/lib/i18n'

export function HomePage() {
  const { lang } = useParams({ from: '/$lang/' })
  const navigate = useNavigate()

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 p-6 text-center">
      <ThemeToggle className="fixed right-4 top-4 z-50" />
      <h1 className="text-4xl font-bold tracking-tight">{i18n('pages.home.bem-vindo-ao-cubs')}</h1>
      <p className="max-w-md text-balance text-muted-foreground">{i18n('pages.home.descricao')}</p>
      <div className="flex gap-3">
        <Button
          variant="filled"
          color="blue"
          onClick={() => navigate({ to: '/$lang/sign-in', params: { lang } })}
        >
          {i18n('pages.home.entrar')}
        </Button>
        <Button
          variant="outlined"
          color="blue"
          onClick={() => navigate({ to: '/$lang/sign-up', params: { lang } })}
        >
          {i18n('pages.home.criar-conta')}
        </Button>
      </div>
    </main>
  )
}
