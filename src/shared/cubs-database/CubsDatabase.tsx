import { useState } from 'react'
import { Icon } from '@iconify/react'
import { cn, type ContextMenuItem } from 'cubs-components'

import { ViewTabsBar } from './components/ViewTabsBar'
import { TableView } from './components/TableView'
import type { TableRowLabels } from './components/TableRow'
import type { DataViewSettings, DataViewType, HeaderCol, RowData } from './types'
import { reorderByIds } from './utils'

const FALLBACK_VIEW: DataViewType = {
  view: 'table',
  name: '',
  filters: '',
  orderedHeaderCols: [],
}

export interface CubsDatabaseProps {
  /** Views salvas — chave é o ULID da view; cada uma vira uma tab da topbar. */
  settings: DataViewSettings
  /** Colunas na ordem natural de display (esq→dir); a view pode reordenar. */
  headerCols: HeaderCol[]
  rows: RowData[]
  /** Modo controlado da view ativa; sem isso o componente controla sozinho. */
  activeViewId?: string
  onViewChange?: (viewId: string) => void
  /** Itens do ContextMenu das tabs (botão direito; app host injeta i18n). */
  viewMenuItems?: (viewId: string) => ContextMenuItem[]
  /** Clique no botão "Abrir ›" de uma linha — recebe a row crua. */
  onOpenRow?: (row: RowData) => void
  /** Fetch inicial em andamento → skeleton. */
  loading?: boolean
  emptyLabel?: string
  /** Texto das views ainda não implementadas (board/calendar). */
  placeholderLabel?: string
  /** Labels de acessibilidade/texto dos controles da linha. */
  labels?: TableRowLabels
  className?: string
}

/**
 * Visualização da base simulada (PageTree): topbar de views (tabs + context
 * menu no botão direito) e a view ativa — sem chrome em volta, só a view.
 * Por enquanto só 'table' renderiza de verdade; board e calendar mostram
 * placeholder.
 */
export function CubsDatabase({
  // Defaults defensivos: consumidor JS (sem TS) pode omitir na prática.
  settings = {},
  headerCols = [],
  rows = [],
  activeViewId,
  onViewChange,
  viewMenuItems,
  onOpenRow,
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
    <section className={cn('w-full', className)}>
      <ViewTabsBar
        settings={settings}
        activeViewId={currentViewId}
        onViewChange={handleViewChange}
        viewMenuItems={viewMenuItems}
      />

      <div className="pt-2">
        {currentView.view === 'table' ? (
          <TableView
            columns={orderedColumns}
            rows={rows}
            columnWidths={currentView.columnWidths}
            loading={loading}
            emptyLabel={emptyLabel}
            onOpenRow={onOpenRow}
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
