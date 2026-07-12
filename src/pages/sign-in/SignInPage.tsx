import { FormProvider, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from '@tanstack/react-router'

import { Button } from '@components/Button'
import { TextField } from '@components/TextField'
import { useAuth } from '@contexts/AuthContext'
import { i18n } from '@/lib/i18n'
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
      <div className="w-full max-w-sm rounded-xl border border-divider bg-contrast p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">
          {i18n('pages.sign-in.entre-seja-bem-vindo')}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{i18n('pages.sign-in.subtitulo')}</p>

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

            {serverError && <p className="text-sm text-destructive">{serverError}</p>}

            <Button type="submit" variant="filled" color="blue" disabled={signIn.isPending}>
              {signIn.isPending
                ? i18n('pages.sign-in.entrando')
                : i18n('pages.sign-in.botao-entrar')}
            </Button>
          </form>
        </FormProvider>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {i18n('pages.sign-in.nao-tem-conta')}{' '}
          <Link
            to="/$lang/sign-up"
            params={{ lang }}
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            {i18n('pages.sign-in.link-criar-conta')}
          </Link>
        </p>
      </div>
    </main>
  )
}
