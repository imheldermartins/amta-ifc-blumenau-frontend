import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Button } from '@components/Button'
import { TextField } from '@components/TextField'
import { i18n } from '@/lib/i18n'
import { combineRules, validators } from '@/lib/validators'

interface ProfileFormValues {
  nome: string
  telefone: string
  cpf: string
  preco: string
}

/**
 * Demonstração do kit de formulários: react-hook-form via contexto
 * (FormProvider + TextField), máscaras (telefone/CPF), validators com
 * mensagens prontas e prévia ao vivo com watch().
 */
export function FormExampleSection() {
  const form = useForm<ProfileFormValues>({
    mode: 'onTouched',
    defaultValues: { nome: '', telefone: '', cpf: '', preco: '' },
  })
  const [submitted, setSubmitted] = useState<ProfileFormValues | null>(null)

  // watch() re-renderiza a section a cada tecla — é o que move a prévia.
  const values = form.watch()
  const empty = i18n('pages.app.exemplo-formulario.previa-vazio')

  return (
    <section className="rounded-xl border border-divider bg-contrast p-6">
      <h3 className="text-lg font-bold tracking-tight">
        {i18n('pages.app.exemplo-formulario.titulo')}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {i18n('pages.app.exemplo-formulario.descricao')}
      </p>

      <FormProvider {...form}>
        <form
          className="mt-4 flex flex-col gap-4"
          onSubmit={form.handleSubmit((data) => setSubmitted(data))}
          noValidate
        >
          <TextField
            name="nome"
            label={i18n('pages.app.exemplo-formulario.campo-nome')}
            placeholder={i18n('pages.app.exemplo-formulario.campo-nome-placeholder')}
            rules={validators.required()}
          />
          <TextField
            name="telefone"
            label={i18n('pages.app.exemplo-formulario.campo-telefone')}
            placeholder={i18n('pages.app.exemplo-formulario.campo-telefone-placeholder')}
            inputMode="tel"
            mask="phone-br"
            rules={combineRules(validators.required(), validators.phoneBr())}
          />
          <TextField
            name="cpf"
            label={i18n('pages.app.exemplo-formulario.campo-cpf')}
            placeholder={i18n('pages.app.exemplo-formulario.campo-cpf-placeholder')}
            inputMode="numeric"
            mask="cpf"
            rules={combineRules(validators.required(), validators.cpf())}
          />
          <TextField
            name="preco"
            label={i18n('pages.app.exemplo-formulario.campo-preco')}
            placeholder={i18n('pages.app.exemplo-formulario.campo-preco-placeholder')}
            inputMode="numeric"
            mask="currency"
          />

          <Button type="submit" variant="filled" color="green">
            {i18n('pages.app.exemplo-formulario.botao-salvar')}
          </Button>
        </form>
      </FormProvider>

      <div className="mt-4 rounded-lg border border-divider bg-background p-4 text-sm">
        <p className="font-medium">{i18n('pages.app.exemplo-formulario.previa-titulo')}</p>
        <ul className="mt-2 space-y-1 text-muted-foreground">
          <li>
            {i18n('pages.app.exemplo-formulario.campo-nome')}: {values.nome || empty}
          </li>
          <li>
            {i18n('pages.app.exemplo-formulario.campo-telefone')}: {values.telefone || empty}
          </li>
          <li>
            {i18n('pages.app.exemplo-formulario.campo-cpf')}: {values.cpf || empty}
          </li>
          <li>
            {i18n('pages.app.exemplo-formulario.campo-preco')}: {values.preco || empty}
          </li>
        </ul>

        {submitted && (
          <p className="mt-3 border-t border-divider pt-3 text-green-600 dark:text-green-400">
            {i18n('pages.app.exemplo-formulario.dados-enviados')}{' '}
            <span className="font-mono text-xs">{JSON.stringify(submitted)}</span>
          </p>
        )}
      </div>
    </section>
  )
}
