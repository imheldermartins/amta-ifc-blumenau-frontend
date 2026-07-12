import { createFileRoute, redirect } from '@tanstack/react-router'

import { DEFAULT_LANGUAGE } from '@/lib/i18n'

/** Raiz do site: manda para a rota inicial no idioma padrão (`/pt-br`). */
export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/$lang', params: { lang: DEFAULT_LANGUAGE.slug } })
  },
})
