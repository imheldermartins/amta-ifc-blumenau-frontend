import { createFileRoute, redirect } from '@tanstack/react-router'

import { AppLayout } from '@/pages/app/AppLayout'
import { authService } from '@/services/AuthService'

/** Área privada: exige autenticação; sem sessão, volta para o sign-in. */
export const Route = createFileRoute('/$lang/app')({
  beforeLoad: ({ params }) => {
    if (!authService.getStoredUser()) {
      throw redirect({ to: '/$lang/sign-in', params: { lang: params.lang } })
    }
  },
  component: AppLayout,
})
