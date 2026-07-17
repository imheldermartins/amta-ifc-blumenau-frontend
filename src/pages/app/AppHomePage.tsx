import { useEffect, useMemo, useState } from 'react'
import { CubsDatabase, mockableData } from 'cubs-database'
import type { HeaderCol, RowData } from 'cubs-database'

import { i18n } from '@/lib/i18n'
import { Typography } from '@components/Typography'
// import { FormExampleSection } from '@/pages/app/sections/FormExampleSection'
// import { SocketExampleSection } from '@/pages/app/sections/SocketExampleSection'

const dataset = mockableData.pageTree

/** Conteúdo provisório provando que as rotas internas renderizam no Outlet de /app. */
export function AppHomePage() {
  // Simula o fetch inicial da base (a lib recebe `loading` e mostra skeleton).
  const [rows, setRows] = useState<RowData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setRows(dataset.rows)
      setLoading(false)
    }, 700)
    return () => clearTimeout(timer)
  }, [])

  // O app host injeta o comportamento (e i18n) por cima do handle do mock.
  const headerCols = useMemo<HeaderCol[]>(
    () =>
      dataset.headerCols.map((column) =>
        column.handle
          ? {
              ...column,
              handle: {
                ...column.handle,
                name: i18n('pages.app.cubs-database.abrir'),
                onClick: (row: RowData) => console.log('[cubs-database] abrir página:', row),
              },
            }
          : column,
      ),
    [],
  )

  return (
    <div className="mx-auto my-0 w-full max-w-5xl p-6">
      <Typography variant="h1">
          {i18n('pages.app.headline')}
        </Typography>

      <CubsDatabase
        className="mt-8"
        title={i18n('pages.app.cubs-database.titulo')}
        tableName={dataset.tableName}
        settings={dataset.settings}
        headerCols={headerCols}
        rows={rows}
        loading={loading}
        emptyLabel={i18n('pages.app.cubs-database.vazio')}
        placeholderLabel={i18n('pages.app.cubs-database.em-breve')}
        labels={{
          drag: i18n('pages.app.cubs-database.arrastar-linha'),
          select: i18n('pages.app.cubs-database.selecionar-linha'),
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
