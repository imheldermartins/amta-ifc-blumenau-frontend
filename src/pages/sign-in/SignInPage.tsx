import { FormProvider, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from '@tanstack/react-router'

import { Button } from '@components/Button'
import { TextField } from '@components/TextField'
import { Typography } from '@components/Typography'
import { useAuth } from '@contexts/AuthContext'
import { i18n } from '@/lib/i18n'
import { PALETTE } from '@/lib/palette'
import { cn } from '@/lib/utils'
import { combineRules, validators } from '@/lib/validators'
import { InvalidCredentialsError } from '@/services/AuthService'

interface SignInFormValues {
  email: string
  password: string
}

export function SignInPage() {
  const { lang } = useParams({ from: '/$lang/_public/sign-in' })
  const navigate = useNavigate()
  const auth = useAuth()

  const form = useForm<SignInFormValues>({
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  })

  const signIn = useMutation({
    mutationFn: (values: SignInFormValues) => auth.signIn(values),
    onSuccess: () => navigate({ to: '/$lang/app', params: { lang } }),
  })

  const serverError = signIn.isError
    ? signIn.error instanceof InvalidCredentialsError
      ? i18n('pages.sign-in.erro-credenciais-invalidas')
      : i18n('pages.sign-in.erro-generico')
    : null

  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <div className="w-full max-w-sm rounded border border-divider bg-contrast p-8 shadow-sm">
        <Typography variant="h2" as="h1">
          {i18n('pages.sign-in.entre-seja-bem-vindo')}
        </Typography>
        <Typography variant="subtitle" className="mt-1">
          {i18n('pages.sign-in.subtitulo')}
        </Typography>

        <FormProvider {...form}>
          <form
            className="mt-6 flex flex-col gap-4"
            onSubmit={form.handleSubmit((values) => signIn.mutate(values))}
            noValidate
          >
            <TextField
              name="email"
              label={i18n('pages.sign-in.campo-email')}
              type="email"
              autoComplete="email"
              placeholder={i18n('pages.sign-in.campo-email-placeholder')}
              rules={combineRules(validators.required(), validators.email())}
            />
            <TextField
              name="password"
              label={i18n('pages.sign-in.campo-senha')}
              type="password"
              autoComplete="current-password"
              placeholder={i18n('pages.sign-in.campo-senha-placeholder')}
              rules={validators.required()}
            />

            {serverError && (
              <Typography variant="body" className={PALETTE.red.text}>
                {serverError}
              </Typography>
            )}

            <Button type="submit" variant="filled" color="blue" disabled={signIn.isPending}>
              {signIn.isPending
                ? i18n('pages.sign-in.entrando')
                : i18n('pages.sign-in.botao-entrar')}
            </Button>
          </form>
        </FormProvider>

        <Typography variant="subtitle" className="mt-6 text-center">
          {i18n('pages.sign-in.nao-tem-conta')}{' '}
          <Link
            to="/$lang/sign-up"
            params={{ lang }}
            className={cn('font-medium hover:underline', PALETTE.blue.text)}
          >
            {i18n('pages.sign-in.link-criar-conta')}
          </Link>
        </Typography>
      </div>
    </main>
  )
}
