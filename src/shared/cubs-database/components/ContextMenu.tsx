import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import { Icon } from '@iconify/react'

import type { ContextMenuItem } from '../types'
import { cx } from '../utils'

export interface ContextMenuProps {
  open: boolean
  onClose: () => void
  items: ContextMenuItem[]
  /** Posicionamento fica com o caller (painel é `absolute`; pai `relative`). */
  className?: string
  style?: CSSProperties
}

/**
 * Menu contextual (o caller controla `open` — na lib, aberto com botão
 * DIREITO na tab da view). Fundo "glass": mesmo tom do background com
 * transparência + backdrop blur. Fecha com clique fora ou Escape.
 */
export function ContextMenu({ open, onClose, items, className, style }: ContextMenuProps) {
  useEffect(() => {
    if (!open) return
    const handlePointerDown = () => onClose()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="menu"
      style={style}
      onPointerDown={(event) => event.stopPropagation()}
      onContextMenu={(event) => event.preventDefault()}
      className={cx(
        'absolute z-50 mt-1 min-w-44 rounded-lg border border-divider-contrast p-1 shadow-xl',
        'bg-glass backdrop-blur-md',
        className,
      )}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="menuitem"
          className={cx(
            'flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors hover:bg-active',
            item.danger && 'text-p-red',
          )}
          onClick={() => {
            item.onSelect?.()
            onClose()
          }}
        >
          {item.icon ? <Icon icon={item.icon} fontSize={15} className="shrink-0" /> : null}
          <span className="whitespace-nowrap">{item.label}</span>
        </button>
      ))}
    </div>
  )
}
