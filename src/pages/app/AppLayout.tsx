import { Outlet } from '@tanstack/react-router'
// import { Outlet, useNavigate, useParams } from '@tanstack/react-router'

// import { Button } from '@components/Button'
import { ThemeToggle } from '@components/ThemeToggle'
import { Typography } from '@components/Typography'
// import { useAuth } from '@contexts/AuthContext'
import { i18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/**
 * Casca da área autenticada (/app). As rotas filhas renderizam no <Outlet />.
 * A sidebar entra aqui futuramente (fora de escopo por enquanto).
 */
export function AppLayout() {
  // const { lang } = useParams({ from: '/$lang/app' })
  // const navigate = useNavigate()
  // const auth = useAuth()

  // function handleSignOut() {
  //   auth.signOut()
  //   void navigate({ to: '/$lang/sign-in', params: { lang } })
  // }

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
        <Typography variant="h3" as="span" className='text-center w-full'>
          Searchbar
        </Typography>
      </header>

      <div className='flex flex-1'>
        <section className='bg-contrast border border-divider p-3 m-3 rounded-lg shadow-xl w-full max-w-48 flex flex-col justify-between items-start'>

          <div className='w-full'>
            <Typography variant="subtitle">{i18n('common.app-name')}</Typography>

            <nav className='w-full mt-4'>
              <ul className='w-full flex flex-col gap-2'>
                {Array.from({ length: 4 }).map((_, index) => (
                  <li key={index} className='w-full'>
                    <a
                      href={`/app/page-${index + 1}`}
                      className={cn(
                        'block px-3 py-1.5 rounded transition-colors hover:bg-active',
                        // item ativo (aqui fixo só de exemplo) usa o mesmo token
                        index === 0 && 'bg-active',
                      )}
                    >
                      pipo-popo {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div>
            <ThemeToggle />
          </div>
        </section>

        <main className='flex-1'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
