import { useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { Icon } from '@iconify/react'
import { ContextMenu, cn, type ContextMenuItem } from 'cubs-components'

import type { DataViewKind, DataViewSettings } from '../types'

const VIEW_ICON: Record<DataViewKind, string> = {
  table: 'lucide:table',
  board: 'lucide:kanban',
  calendar: 'lucide:calendar',
}

export interface ViewTabsBarProps {
  settings: DataViewSettings
  activeViewId: string
  onViewChange: (viewId: string) => void
  /** Itens do ContextMenu da tab (aberto SOMENTE com botão direito). */
  viewMenuItems?: (viewId: string) => ContextMenuItem[]
}

/**
 * Topbar de views: uma tab por chave de `settings` (sem close por enquanto).
 * O scroll é SÓ horizontal (vertical hidden). Clique esquerdo ativa a view;
 * botão direito abre o ContextMenu da tab (segurar/arrastar fica para o
 * drag-and-drop futuro).
 */
export function ViewTabsBar({ settings, activeViewId, onViewChange, viewMenuItems }: ViewTabsBarProps) {
  const barRef = useRef<HTMLDivElement>(null)
  const [menu, setMenu] = useState<{ viewId: string; left: number } | null>(null)

  const handleTabContextMenu = (viewId: string, event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (!viewMenuItems) return
    const barRect = barRef.current?.getBoundingClientRect()
    const tabRect = event.currentTarget.getBoundingClientRect()
    const left = barRect ? tabRect.left - barRect.left : 0
    setMenu({ viewId, left })
  }

  return (
    <div ref={barRef} className="relative">
      <div
        className="flex items-end gap-1 overflow-x-auto overflow-y-hidden border-b border-divider"
        onScroll={() => setMenu(null)}
      >
        {Object.entries(settings).map(([viewId, view]) => {
          const active = viewId === activeViewId
          return (
            <button
              key={viewId}
              type="button"
              data-state={active ? 'active' : 'inactive'}
              onClick={() => {
                setMenu(null)
                if (!active) onViewChange(viewId)
              }}
              onContextMenu={(event) => handleTabContextMenu(viewId, event)}
              className={cn(
                '-mb-px flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-1.5 text-sm transition-colors',
                active
                  ? 'border-p-purple text-foreground'
                  : 'border-transparent opacity-60 hover:bg-active hover:opacity-100',
              )}
            >
              <Icon icon={VIEW_ICON[view.view]} fontSize={15} className="shrink-0" />
              {view.name}
            </button>
          )
        })}
      </div>

      {menu ? (
        <ContextMenu
          open
          onClose={() => setMenu(null)}
          items={viewMenuItems?.(menu.viewId) ?? []}
          className="top-full"
          style={{ left: menu.left }}
        />
      ) : null}
    </div>
  )
}
