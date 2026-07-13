import { useState } from 'react'
import { Link, Outlet, useLocation, useParams } from '@tanstack/react-router'
import { Icon } from '@iconify/react'

import { Button } from '@components/Button'
import { Switch } from '@components/Switch'
import { Typography } from '@components/Typography'
import { useTheme } from '@/hooks/useTheme'
import { i18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { THEME } from '@/lib/theme'
import { PALETTE } from '@/lib/palette'

export function AppLayout() {
  const { lang } = useParams({ from: '/$lang/app' })
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const navItems = [
    { name: i18n('common.navigation.home'), href: `/${lang}/app`, icon: 'lucide:workflow' },
    { name: i18n('common.navigation.chat'), href: `/${lang}/app/mychat`, icon: 'lucide:message-circle' },
    { name: i18n('common.navigation.agenda'), href: `/${lang}/app/schedule`, icon: 'lucide:calendar' },
  ]

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
            className={THEME.textMuted}
          />
        </Button>
        <Typography variant="h3" as="span" className='text-center w-full font-light'>
          {' '}
        </Typography>

        <div className='flex items-center gap-2 hover:bg-active px-2 py-1 rounded-lg transition-colors cursor-pointer'>
          <Icon icon='lucide:graduation-cap' className={THEME.textMuted} />
          <Typography variant="subtitle" as='span' className='whitespace-nowrap text-nowrap'>
            IFC Blumenau
          </Typography>
        </div>
      </header>

      <div className='flex flex-1'>
        <section
          className={cn(
            'bg-contrast border border-divider-contrast px-2 py-3 m-4 rounded-lg shadow-xl',
            'flex flex-col justify-between shrink-0 overflow-hidden',
            'transition-[width] duration-300 ease-in-out',
            collapsed ? 'w-16 items-center' : 'w-48 items-start',
          )}
        >
          <div className='w-full'>
            <nav>
              <ul className={cn('flex flex-col gap-2')}>
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.href}
                      className={cn(
                        'w-full inline-flex items-center gap-2 px-3 py-1.5 rounded transition-all ease-in duration-200',
                        location.pathname === item.href
                          ? `${PALETTE.purple.bg} ${PALETTE.purple.textOnFilled} ${PALETTE.purple.shadow} ${PALETTE.purple.bgHover}`
                          : 'hover:bg-active',
                      )}
                    >
                      <Icon icon={item.icon} fontSize={18} className={cn('shrink-0', collapsed && 'transition-discrete ml-0.5')} />
                      <Typography variant="body" as="span" className={cn('whitespace-nowrap', collapsed && 'hidden')}>
                        {item.name}
                      </Typography>
                    </Link>
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
