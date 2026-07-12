import type { RegisterOptions } from 'react-hook-form'

import { i18n } from '@/lib/i18n'
import { unmask } from '@/lib/masks'

/**
 * Validators reutilizáveis para react-hook-form, com as mensagens de erro já
 * definidas (chaves `validation.*` do i18n).
 *
 * Uso — cada validator devolve um pedaço de `RegisterOptions`; combine com
 * `combineRules`:
 *
 *   <TextField name="cpf" mask="cpf"
 *     rules={combineRules(validators.required(), validators.cpf())} />
 *
 * Convenção: validators de formato tratam vazio como válido — quem acusa
 * campo vazio é o `required()`. Assim um campo opcional só é validado quando
 * preenchido.
 */
type Rules = RegisterOptions

/** Valida os dígitos verificadores do CPF (rejeita sequências repetidas). */
export function isValidCpf(value: string): boolean {
  const cpf = unmask(value)
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false

  for (const factor of [10, 11]) {
    const length = factor - 1
    let sum = 0
    for (let index = 0; index < length; index += 1) {
      sum += Number(cpf[index]) * (factor - index)
    }
    const expected = ((sum * 10) % 11) % 10
    if (expected !== Number(cpf[length])) return false
  }
  return true
}

export const validators = {
  required(): Rules {
    return { required: i18n('validation.campo-obrigatorio') }
  },

  email(): Rules {
    return {
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: i18n('validation.email-invalido'),
      },
    }
  },

  minLength(count: number): Rules {
    return {
      minLength: { value: count, message: i18n('validation.minimo-caracteres', { count }) },
    }
  },

  /** Telefone BR com DDD: 10 (fixo) ou 11 (celular) dígitos. */
  phoneBr(): Rules {
    return {
      validate: {
        phoneBr: (value: unknown) => {
          if (typeof value !== 'string' || value === '') return true
          const digits = unmask(value)
          return (digits.length === 10 || digits.length === 11) || i18n('validation.telefone-invalido')
        },
      },
    }
  },

  cpf(): Rules {
    return {
      validate: {
        cpf: (value: unknown) => {
          if (typeof value !== 'string' || value === '') return true
          return isValidCpf(value) || i18n('validation.cpf-invalido')
        },
      },
    }
  },
}

/**
 * Mescla vários validators num único `RegisterOptions`, unindo os `validate`
 * nomeados (por isso os validators usam sempre a forma de objeto).
 */
export function combineRules(...rules: Rules[]): Rules {
  const merged: Record<string, unknown> = {}
  const validate: Record<string, unknown> = {}

  for (const rule of rules) {
    const { validate: ruleValidate, ...rest } = rule as Record<string, unknown>
    Object.assign(merged, rest)
    if (ruleValidate && typeof ruleValidate === 'object') {
      Object.assign(validate, ruleValidate)
    }
  }

  if (Object.keys(validate).length > 0) {
    merged.validate = validate
  }
  // Cast na borda: RegisterOptions é um union com discriminantes
  // (pattern/valueAsNumber/valueAsDate) que o merge dinâmico não preserva.
  return merged as Rules
}
