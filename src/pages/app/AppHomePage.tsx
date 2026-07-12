import { i18n } from '@/lib/i18n'
import { FormExampleSection } from '@/pages/app/sections/FormExampleSection'
import { SocketExampleSection } from '@/pages/app/sections/SocketExampleSection'

/** Conteúdo provisório provando que as rotas internas renderizam no Outlet de /app. */
export function AppHomePage() {
  return (
    <div className="mx-auto my-0 w-full max-w-5xl p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{i18n('pages.app.ola-mundo')}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{i18n('pages.app.descricao-outlet')}</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <FormExampleSection />
        <SocketExampleSection />
      </div>
    </div>
  )
}
