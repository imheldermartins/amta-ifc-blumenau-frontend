import { useState } from 'react'
import type { ReactNode } from 'react'
import { Icon } from '@iconify/react'

import { ViewTabsBar } from './components/ViewTabsBar'
import { TableView } from './components/TableView'
import type { TableRowLabels } from './components/TableRow'
import type { ContextMenuItem, DataViewSettings, DataViewType, HeaderCol, RowData } from './types'
import { CUBS_DATABASE_VERSION } from './version'
import { cx, reorderByIds } from './utils'

const FALLBACK_VIEW: DataViewType = {
  view: 'table',
  name: '',
  filters: '',
  orderedHeaderCols: [],
}

export interface CubsDatabaseProps {
  /** Título exibido na barra superior. */
  title?: ReactNode
  /** Nome "físico" da tabela simulada (ex.: page_tree). */
  tableName?: string
  /** Views salvas — chave é o ULID da view; cada uma vira uma tab da topbar. */
  settings: DataViewSettings
  /** Colunas na ordem natural de display (esq→dir); a view pode reordenar. */
  headerCols: HeaderCol[]
  rows: RowData[]
  /** Modo controlado da view ativa; sem isso o componente controla sozinho. */
  activeViewId?: string
  onViewChange?: (viewId: string) => void
  /** Itens do ContextMenu da tab ativa (o app host injeta labels/i18n). */
  viewMenuItems?: (viewId: string) => ContextMenuItem[]
  /** Fetch inicial em andamento → skeleton. */
  loading?: boolean
  emptyLabel?: string
  /** Texto das views ainda não implementadas (board/calendar). */
  placeholderLabel?: string
  /** Labels de acessibilidade do gutter (drag/checkbox). */
  labels?: TableRowLabels
  className?: string
}

/**
 * Visualização da base simulada (PageTree): topbar de views (tabs + context
 * menu) e a view ativa. Por enquanto só 'table' renderiza de verdade; board e
 * calendar mostram placeholder.
 */
export function CubsDatabase({
  title,
  tableName,
  // Defaults defensivos: consumidor JS (sem TS) pode omitir na prática.
  settings = {},
  headerCols = [],
  rows = [],
  activeViewId,
  onViewChange,
  viewMenuItems,
  loading,
  emptyLabel,
  placeholderLabel = 'Em breve.',
  labels,
  className,
}: CubsDatabaseProps) {
  const [internalViewId, setInternalViewId] = useState(() => Object.keys(settings)[0] ?? '')
  const currentViewId = activeViewId ?? internalViewId
  const currentView = settings[currentViewId] ?? FALLBACK_VIEW

  const handleViewChange = (viewId: string) => {
    setInternalViewId(viewId)
    onViewChange?.(viewId)
  }

  const orderedColumns = reorderByIds(headerCols, currentView.orderedHeaderCols)

  return (
    <section className={cx('w-full', className)}>
      <header className="flex items-center justify-between gap-3 px-1 pb-2">
        <div className="flex items-baseline gap-2">
          {title ? <h2 className="text-base font-semibold">{title}</h2> : null}
          {tableName ? (
            <code className="rounded bg-active px-1.5 py-0.5 text-xs">{tableName}</code>
          ) : null}
        </div>
        <span className="whitespace-nowrap text-xs opacity-60">
          cubs-database v{CUBS_DATABASE_VERSION}
        </span>
      </header>

      <ViewTabsBar
        settings={settings}
        activeViewId={currentViewId}
        onViewChange={handleViewChange}
        viewMenuItems={viewMenuItems}
      />

      <div className="pt-2">
        {/* Should use mappedView from object */}
        {currentView.view === 'table' ? (
          <TableView
            columns={orderedColumns}
            rows={rows}
            loading={loading}
            emptyLabel={emptyLabel}
            labels={labels}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-divider-contrast px-4 py-10 opacity-60">
            <Icon
              icon={currentView.view === 'board' ? 'lucide:kanban' : 'lucide:calendar'}
              fontSize={22}
            />
            <span className="text-sm">{placeholderLabel}</span>
          </div>
        )}
      </div>
    </section>
  )
}
