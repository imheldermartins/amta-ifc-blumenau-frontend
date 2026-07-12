import { FormProvider, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from '@tanstack/react-router'

import { Button } from '@components/Button'
import { TextField } from '@components/TextField'
import { useAuth } from '@contexts/AuthContext'
import { i18n } from '@/lib/i18n'
import { combineRules, validators } from '@/lib/validators'
import { EmailInUseError } from '@/services/AuthService'

interface SignUpFormValues {
  name: string
  email: string
  password: string
}

export function SignUpPage() {
  const { lang } = useParams({ from: '/$lang/_public/sign-up' })
  const navigate = useNavigate()
  const auth = useAuth()

  const form = useForm<SignUpFormValues>({
    mode: 'onTouched',
    defaultValues: { name: '', email: '', password: '' },
  })

  const signUp = useMutation({
    mutationFn: (values: SignUpFormValues) => auth.signUp(values),
    onSuccess: () => navigate({ to: '/$lang/app', params: { lang } }),
  })

  const serverError = signUp.isError
    ? signUp.error instanceof EmailInUseError
      ? i18n('pages.sign-up.erro-email-em-uso')
      : i18n('pages.sign-up.erro-generico')
    : null

  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-xl border border-divider bg-contrast p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">
          {i18n('pages.sign-up.crie-sua-conta')}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{i18n('pages.sign-up.subtitulo')}</p>

        <FormProvider {...form}>
          <form
            className="mt-6 flex flex-col gap-4"
            onSubmit={form.handleSubmit((values) => signUp.mutate(values))}
            noValidate
          >
            <TextField
              name="name"
              label={i18n('pages.sign-up.campo-nome')}
              type="text"
              autoComplete="name"
              placeholder={i18n('pages.sign-up.campo-nome-placeholder')}
              rules={validators.required()}
            />
            <TextField
              name="email"
              label={i18n('pages.sign-up.campo-email')}
              type="email"
              autoComplete="email"
              placeholder={i18n('pages.sign-up.campo-email-placeholder')}
              rules={combineRules(validators.required(), validators.email())}
            />
            <TextField
              name="password"
              label={i18n('pages.sign-up.campo-senha')}
              type="password"
              autoComplete="new-password"
              placeholder={i18n('pages.sign-up.campo-senha-placeholder')}
              rules={combineRules(validators.required(), validators.minLength(6))}
            />

            {serverError && <p className="text-sm text-destructive">{serverError}</p>}

            <Button type="submit" variant="filled" color="blue" disabled={signUp.isPending}>
              {signUp.isPending
                ? i18n('pages.sign-up.criando-conta')
                : i18n('pages.sign-up.botao-criar-conta')}
            </Button>
          </form>
        </FormProvider>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {i18n('pages.sign-up.ja-tem-conta')}{' '}
          <Link
            to="/$lang/sign-in"
            params={{ lang }}
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            {i18n('pages.sign-up.link-entrar')}
          </Link>
        </p>
      </div>
    </main>
  )
}
