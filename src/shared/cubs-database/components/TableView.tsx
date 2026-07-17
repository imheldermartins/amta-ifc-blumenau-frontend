import { useState } from 'react'
import { Icon } from '@iconify/react'

import type { ColumnDataType, HeaderCol, RowData } from '../types'
import { cx } from '../utils'
import { TableRow } from './TableRow'
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
  loading?: boolean
  emptyLabel?: string
  labels?: TableRowLabels
}

/**
 * View 'table': header com ícone do tipo + título, e linhas contíguas em
 * zebra striping (background × contrast). O gutter de controles fica FORA da
 * área listrada, com um respiro à direita.
 */
export function TableView({ columns, rows, loading, emptyLabel = 'Nenhum registro.', labels }: TableViewProps) {
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(new Set())

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
      <div role="row" className="flex">
        <div className="mr-2 w-14 shrink-0" aria-hidden />
        <div className="flex min-w-0 flex-1 border-b border-divider-contrast">
          {columns.map((column) => (
            <div
              role="columnheader"
              key={column.id}
              className="flex min-w-36 flex-1 items-center gap-1.5 px-3 py-2 text-sm font-medium opacity-60"
            >
              <Icon icon={TYPE_ICON[column.type ?? 'text']} fontSize={14} className="shrink-0" />
              <span className="truncate">{column.title}</span>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div aria-hidden>
          {[0, 1, 2, 3].map((skeletonIndex) => (
            <div key={skeletonIndex} className="flex">
              <div className="mr-2 w-14 shrink-0" />
              <div
                className={cx(
                  'flex h-9 flex-1 items-center px-3',
                  skeletonIndex % 2 === 1 ? 'bg-contrast' : 'bg-background',
                )}
              >
                <div className="h-3 w-1/3 animate-pulse rounded bg-active" />
              </div>
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="flex">
          <div className="mr-2 w-14 shrink-0" />
          <div className="flex-1 px-3 py-8 text-center text-sm opacity-60">{emptyLabel}</div>
        </div>
      ) : (
        rows.map((row, rowIndex) => (
          <TableRow
            key={row.id}
            row={row}
            columns={columns}
            zebra={rowIndex % 2 === 1}
            selected={selectedIds.has(row.id)}
            onSelectedChange={(checked) => setRowSelected(row.id, checked)}
            labels={labels}
          />
        ))
      )}
    </div>
  )
}
