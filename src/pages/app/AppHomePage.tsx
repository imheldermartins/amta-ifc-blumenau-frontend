import { useEffect, useState } from 'react'
import { CubsDatabase } from 'cubs-database'

import type { ParsedDatabase } from '@/lib/databaseParser'
import { i18n } from '@/lib/i18n'
import { databaseService, FIXED_WORKSPACE_ID } from '@/services/DatabaseService'
import { Typography } from '@components/Typography'
// import { FormExampleSection } from '@/pages/app/sections/FormExampleSection'
// import { SocketExampleSection } from '@/pages/app/sections/SocketExampleSection'

/** Conteúdo provisório provando que as rotas internas renderizam no Outlet de /app. */
export function AppHomePage() {
  const [database, setDatabase] = useState<ParsedDatabase | null>(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  // Fetch inicial: entra pela workspace em foco (fixa até existir o contexto de
  // workspace) e abre a página de entrada dela como base. O flag `active`
  // descarta a resposta de um unmount no meio do caminho — sem ele, o setState
  // cai num componente que já saiu da árvore.
  useEffect(() => {
    let active = true

    databaseService
      .loadWorkspace(FIXED_WORKSPACE_ID)
      .then((loaded) => {
        if (active) setDatabase(loaded)
      })
      // O ApiService já logou o AppError; aqui só troca o texto da tabela vazia.
      .catch(() => {
        if (active) setFailed(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="mx-auto my-0 w-full max-w-5xl p-6">
      <Typography variant="h1">
          {i18n('pages.app.headline')}
        </Typography>

      <CubsDatabase
        className="mt-8"
        settings={database?.settings ?? {}}
        headerCols={database?.headerCols ?? []}
        rows={database?.rows ?? []}
        loading={loading}
        emptyLabel={i18n(
          failed ? 'pages.app.cubs-database.erro' : 'pages.app.cubs-database.vazio',
        )}
        placeholderLabel={i18n('pages.app.cubs-database.em-breve')}
        onOpenRow={(row) => console.log('abrindo página', row)}
        labels={{
          drag: i18n('pages.app.cubs-database.arrastar-linha'),
          select: i18n('pages.app.cubs-database.selecionar-linha'),
          open: i18n('pages.app.cubs-database.abrir'),
        }}
        viewMenuItems={(viewId) => [
          {
            id: 'rename',
            label: i18n('pages.app.cubs-database.menu.renomear'),
            icon: 'lucide:pencil',
            onSelect: () => console.log('[cubs-database] renomear view', viewId),
          },
          {
            id: 'duplicate',
            label: i18n('pages.app.cubs-database.menu.duplicar'),
            icon: 'lucide:copy',
            onSelect: () => console.log('[cubs-database] duplicar view', viewId),
          },
          {
            id: 'delete',
            label: i18n('pages.app.cubs-database.menu.excluir'),
            icon: 'lucide:trash-2',
            danger: true,
            onSelect: () => console.log('[cubs-database] excluir view', viewId),
          },
        ]}
      />
    </div>
  )
}
