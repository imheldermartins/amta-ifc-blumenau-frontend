import { useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { Icon } from '@iconify/react'

import { Button } from '@components/Button'
import { Switch } from '@components/Switch'
import { Typography } from '@components/Typography'
import { useTheme } from '@/hooks/useTheme'
import { i18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/**
 * Casca da área autenticada (/app). As rotas filhas renderizam no <Outlet />.
 * A sidebar colapsa para só-ícones (estado local `collapsed`).
 */
export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    // <div className="flex min-h-dvh flex-col">
    //   <header className="flex items-center justify-between border-b border-divider bg-contrast px-6 py-3">
    //     <Typography variant="h3" as="span">
    //       {i18n('common.app-name')}
    //     </Typography>
    //     <div className="flex items-center gap-4">
    //       <Typography variant="subtitle" as="span">
    //         {auth.user?.name ?? auth.user?.email}
    //       </Typography>
    //       <ThemeToggle />
    //       <Button variant="outlined" color="red" onClick={handleSignOut}>
    //         {i18n('common.sair')}
    //       </Button>
    //     </div>
    //   </header>

    //   <main className="flex-1">
    //     <Outlet />
    //   </main>
    // </div>
    <div className='flex min-h-dvh flex-col'>

      <header className='flex items-center justify-between border-b border-divider px-6 py-2'>
        <Button
          variant='text'
          color='from-theme'
          className='p-0.5'
          onClick={() => setCollapsed((value) => !value)}
          aria-label={i18n(collapsed ? 'common.expandir-menu' : 'common.recolher-menu')}
        >
          <Icon
            icon={collapsed ? 'lucide:sidebar-open' : 'lucide:sidebar-close'}
            fontSize={20}
            className='text-zinc-500'
          />
        </Button>
        <Typography variant="h3" as="span" className='text-center w-full'>
          Searchbar
        </Typography>

        <div className='flex items-center gap-2 hover:bg-active px-2 py-1 rounded-lg transition-colors cursor-pointer'>
          <Icon icon='lucide:graduation-cap' />
          <Typography variant="subtitle" as='span' className='whitespace-nowrap text-nowrap'>
            IFC Blumenau
          </Typography>
        </div>
      </header>

      <div className='flex flex-1'>
        <section
          className={cn(
            'bg-contrast border border-divider-contrast px-2 py-3 m-4 rounded-lg shadow-xl',
            // shrink-0: a sidebar mantém a largura, não é espremida pelo main.
            // overflow-hidden: recorta a label enquanto ela colapsa.
            'flex flex-col justify-between shrink-0 overflow-hidden',
            // Só a LARGURA anima — fecha da direita p/ esquerda.
            'transition-[width] duration-200 ease-in-out',
            collapsed ? 'w-16 items-center' : 'w-48 items-start',
          )}
        >
          <div className='w-full'>
            <nav>
              <ul className={cn('flex flex-col gap-2', collapsed && 'items-center')}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <li key={index}>
                    <a
                      href={`/app/page-${index + 1}`}
                      className={cn(
                        'flex items-center rounded transition-colors hover:bg-active',
                        // colapsado: quadrado com ícone centrado (sem sobra à direita)
                        collapsed ? 'size-10 justify-center' : 'w-full justify-start px-3 py-1.5',
                      )}
                    >
                      <Icon icon='lucide:file-text' fontSize={18} className='shrink-0' />
                      {/* label só aparece/some — sem animação de fade */}
                      {!collapsed && (
                        <Typography variant="subtitle" as="span" className='ml-2 whitespace-nowrap'>
                          Page {index + 1}
                        </Typography>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={() => toggleTheme()}
            label={collapsed ? undefined : i18n('common.modo-escuro')}
          />
        </section>

        <main className='flex-1'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
