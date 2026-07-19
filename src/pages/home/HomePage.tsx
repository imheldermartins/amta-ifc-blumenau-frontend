import { useNavigate, useParams } from '@tanstack/react-router'
import { Trans } from 'react-i18next'

import { Button } from '@components/Button'
import { Typography } from '@components/Typography'
import { i18n } from '@/lib/i18n'

export function HomePage() {
  const { lang } = useParams({ from: '/$lang/' })
  const navigate = useNavigate()

  return (
    <main className="bg-zinc-100 flex min-h-dvh flex-col items-center justify-center gap-6 p-6 text-center">
      <Typography variant="h1" className="text-7xl font-extrabold tracking-tight">
        <Trans
          i18nKey="pages.home.bem-vindo-ao-cubs"
          values={{ appName: i18n('common.app-name') }}
          components={{ green: <span className="text-p-purple-500" /> }}
        />
      </Typography>
      <Typography variant="h3" className="max-w-md text-balance leading-tight">
        {i18n('pages.home.descricao')}
      </Typography>
      <div className="flex gap-3">
        <Button
          variant="filled"
          onClick={() => navigate({ to: '/$lang/sign-in', params: { lang } })}
        >
          {i18n('pages.home.entrar')}
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate({ to: '/$lang/sign-up', params: { lang } })}
        >
          {i18n('pages.home.criar-conta')}
        </Button>
      </div>
    </main>
  )
}
