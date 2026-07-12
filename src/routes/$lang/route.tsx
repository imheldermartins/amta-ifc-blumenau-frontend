import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { DEFAULT_LANGUAGE, changeLanguage, findLanguageBySlug } from '@/lib/i18n'

/**
 * Layout de idioma: valida o slug da URL (`/pt-br/...`) e ativa o idioma
 * no i18next antes de renderizar qualquer página.
 */
export const Route = createFileRoute('/$lang')({
  beforeLoad: ({ params }) => {
    const language = findLanguageBySlug(params.lang)
    if (!language) {
      throw redirect({ to: '/$lang', params: { lang: DEFAULT_LANGUAGE.slug } })
    }
    changeLanguage(language)
  },
  component: LangLayout,
})

function LangLayout() {
  // Assina o i18next: quando o idioma muda, esta subárvore re-renderiza
  // e as chamadas de i18n() resolvem no idioma novo.
  useTranslation()
  return <Outlet />
}
