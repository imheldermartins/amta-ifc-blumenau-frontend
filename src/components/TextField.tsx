import type { ComponentProps } from 'react'
import { useFormContext, type RegisterOptions } from 'react-hook-form'

import { applyMask, type MaskName } from '@/lib/masks'
import { PALETTE } from '@/lib/palette'
import { cn } from '@/lib/utils'

interface TextFieldBaseProps extends Omit<ComponentProps<'input'>, 'name'> {
  label: string
  /** Máscara aplicada enquanto digita (src/lib/masks.ts). */
  mask?: MaskName
}

interface TextFieldViewProps extends TextFieldBaseProps {
  /** Mensagem de erro a exibir (modo state); no modo form vem do RHF. */
  errorMessage?: string
}

/** Input visual, sempre controlado pelos props que recebe. */
function TextFieldView({ label, mask, errorMessage, className, onChange, ...props }: TextFieldViewProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium">
      {label}
      <input
        {...props}
        onChange={(event) => {
          // A máscara re-formata o valor ANTES de o handler (state ou RHF) ler.
          if (mask) {
            event.target.value = applyMask(mask, event.target.value)
          }
          onChange?.(event)
        }}
        aria-invalid={errorMessage ? true : undefined}
        className={cn(
          'h-10 rounded border border-divider bg-background px-3 text-sm font-normal',
          'placeholder:text-zinc-500 dark:placeholder:text-zinc-400',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-divider',
          errorMessage &&
            cn(PALETTE.red.border, 'focus-visible:ring-rose-300 dark:focus-visible:ring-rose-500'),
          className,
        )}
      />
      {errorMessage && (
        <span role="alert" className={cn('text-xs font-normal', PALETTE.red.text)}>
          {errorMessage}
        </span>
      )}
    </label>
  )
}

/** Versão ligada ao react-hook-form (via `name` + contexto do <FormProvider>). */
interface FormTextFieldProps extends TextFieldBaseProps {
  name: string
  rules?: RegisterOptions
}
function FormTextField({ name, rules, onChange, ...rest }: FormTextFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const registration = register(name, rules)
  const fieldError = errors[name]
  const message = typeof fieldError?.message === 'string' ? fieldError.message : undefined

  return (
    <TextFieldView
      {...rest}
      {...registration}
      errorMessage={message}
      onChange={(event) => {
        void registration.onChange(event)
        onChange?.(event)
      }}
    />
  )
}

/**
 * Input de texto dual-mode — o mesmo componente nos dois fluxos do projeto:
 *
 *  • via FORM (react-hook-form): dentro de <FormProvider>, se registra sozinho.
 *    <TextField name="cpf" label="..." mask="cpf" rules={...} />
 *  • via STATE: controlado à mão.
 *    <TextField label="..." value={valor} onChange={(e) => setValor(e.target.value)}
 *      errorMessage={erro} />
 *
 * `name` presente = modo form (exige <FormProvider> acima). Sem `name`, é um
 * input controlado comum (value/onChange), com `errorMessage` opcional.
 */
export interface TextFieldProps extends TextFieldBaseProps {
  /** Modo form: nome do campo no react-hook-form. */
  name?: string
  /** Modo form: regras de validação (src/lib/validators.ts). */
  rules?: RegisterOptions
  /** Modo state: mensagem de erro a exibir. */
  errorMessage?: string
}

export function TextField({ name, rules, errorMessage, ...rest }: TextFieldProps) {
  if (name != null) {
    return <FormTextField name={name} rules={rules} {...rest} />
  }
  return <TextFieldView errorMessage={errorMessage} {...rest} />
}
