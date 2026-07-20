import { useMemo, useState } from 'react'
import { Icon } from '@iconify/react'
import { cn } from 'cubs-components'

import type { ColumnDataType, HeaderCol, RowData } from '../types'
import { resolveColumnTypes, resolveColumnWidth } from '../utils'
import { CONTROL_CELL_WIDTH, TableRow } from './TableRow'
import type { TableRowLabels } from './TableRow'

const TYPE_ICON: Record<ColumnDataType, string> = {
  text: 'lucide:type',
  numeric: 'lucide:hash',
  select: 'lucide:list',
  date: 'lucide:calendar',
  checkbox: 'lucide:square-check',
}

export interface TableViewProps {
  columns: HeaderCol[]
  rows: RowData[]
  /**
   * `columnWidths` da view: largura em px por ID de coluna. Uma única fonte
   * para header e células — sem isso as duas grades divergem.
   */
  columnWidths?: Record<string, number>
  loading?: boolean
  emptyLabel?: string
  /** Clique no botão "Abrir ›" de uma linha — recebe a row crua. */
  onOpenRow?: (row: RowData) => void
  labels?: TableRowLabels
}

/**
 * View 'table': linhas contíguas em zebra striping (background × contrast)
 * com separadores verticais entre as colunas. A célula de controles ocupa a
 * posição zero (mesma largura no header, para o alinhamento bater).
 *
 * As colunas têm largura FIXA (px), definida na view via `columnWidths` — não
 * na coluna. Header e células resolvem a largura pelo mesmo mapa, então a
 * grade bate mesmo numa linha que não tenha valor para todas as colunas.
 *
 * O TIPO segue a mesma ideia: resolvido uma vez aqui (declarado na coluna ou
 * inferido dos valores) e distribuído — o ícone do header e o render da
 * célula leem do mesmo mapa, nunca decidem cada um por si.
 */
export function TableView({ columns, rows, columnWidths, loading, emptyLabel = 'Nenhum registro.', onOpenRow, labels }: TableViewProps) {
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(new Set())
  const columnTypes = useMemo(() => resolveColumnTypes(columns, rows), [columns, rows])

  const setRowSelected = (rowId: string, checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (checked) next.add(rowId)
      else next.delete(rowId)
      return next
    })
  }

  return (
    <div role="table" className="overflow-x-auto">
      <div role="row" className="flex w-max min-w-full border-b border-divider">
        <div className={cn('shrink-0', CONTROL_CELL_WIDTH)} aria-hidden />
        {columns.map((column) => (
          <div
            role="columnheader"
            key={column.id}
            className="flex shrink-0 items-center gap-1.5 border-l border-divider px-3 py-2 text-sm font-medium opacity-60"
            style={{ width: resolveColumnWidth(columnWidths?.[column.id]) }}
          >
            <Icon icon={TYPE_ICON[columnTypes[column.id]]} fontSize={14} className="shrink-0" />
            <span className="truncate">{column.title}</span>
          </div>
        ))}
      </div>

      {loading ? (
        <div aria-hidden>
          {[0, 1, 2, 3].map((skeletonIndex) => (
            <div
              key={skeletonIndex}
              className={cn('flex', skeletonIndex % 2 === 1 ? 'bg-contrast' : 'bg-background')}
            >
              <div className={cn('shrink-0', CONTROL_CELL_WIDTH)} />
              <div className="flex h-9 flex-1 items-center border-l border-divider px-3">
                <div className="h-3 w-1/3 animate-pulse rounded bg-active" />
              </div>
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="flex">
          <div className={cn('shrink-0', CONTROL_CELL_WIDTH)} />
          <div className="flex-1 border-l border-divider px-3 py-8 text-center text-sm opacity-60">
            {emptyLabel}
          </div>
        </div>
      ) : (
        rows.map((row, rowIndex) => (
          <TableRow
            key={row.id}
            row={row}
            columns={columns}
            columnWidths={columnWidths}
            columnTypes={columnTypes}
            zebra={rowIndex % 2 === 1}
            selected={selectedIds.has(row.id)}
            onSelectedChange={(checked) => setRowSelected(row.id, checked)}
            onOpenRow={onOpenRow}
            labels={labels}
          />
        ))
      )}
    </div>
  )
}
