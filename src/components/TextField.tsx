import type { ComponentProps } from 'react'
import { useFormContext, type RegisterOptions } from 'react-hook-form'

import { applyMask, type MaskName } from '@/lib/masks'
import { PALETTE } from '@/lib/palette'
import { cn } from '@/lib/utils'

export interface TextFieldProps extends Omit<ComponentProps<'input'>, 'name'> {
  label: string
  /** Nome do campo no formulário (react-hook-form). */
  name: string
  /** Máscara aplicada enquanto digita (src/lib/masks.ts). */
  mask?: MaskName
  /** Regras de validação — use os validators prontos de src/lib/validators.ts. */
  rules?: RegisterOptions
}

/**
 * Input de texto integrado ao react-hook-form via contexto: dentro de um
 * <FormProvider>, o campo se registra sozinho (estado, validação e mensagem
 * de erro vêm do form — nada de useState manual).
 *
 * @example
 * <FormProvider {...form}>
 *   <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
 *     <TextField name="cpf" label={i18n('...')} mask="cpf"
 *       rules={combineRules(validators.required(), validators.cpf())} />
 */
export function TextField({ label, name, mask, rules, className, onChange, ...props }: TextFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const registration = register(name, rules)
  const fieldError = errors[name]

  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium">
      {label}
      <input
        {...props}
        {...registration}
        onChange={(event) => {
          // A máscara re-formata o valor ANTES do react-hook-form ler o evento.
          if (mask) {
            event.target.value = applyMask(mask, event.target.value)
          }
          void registration.onChange(event)
          onChange?.(event)
        }}
        aria-invalid={fieldError ? true : undefined}
        className={cn(
          'h-10 rounded border border-divider bg-background px-3 text-sm font-normal',
          'placeholder:text-zinc-500 dark:placeholder:text-zinc-400',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-divider',
          fieldError && cn(PALETTE.red.border, 'focus-visible:ring-rose-300 dark:focus-visible:ring-rose-500'),
          className,
        )}
      />
      {typeof fieldError?.message === 'string' && (
        <span role="alert" className={cn('text-xs font-normal', PALETTE.red.text)}>
          {fieldError.message}
        </span>
      )}
    </label>
  )
}
