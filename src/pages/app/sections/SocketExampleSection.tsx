import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Button } from '@components/Button'
import { TextField } from '@components/TextField'
import { useSocket, type SocketStatus } from '@/hooks/useSocket'
import { i18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { validators } from '@/lib/validators'
import type { EchoReply } from '@/services/SocketService'

interface EchoFormValues {
  message: string
}

const STATUS_STYLES: Record<SocketStatus, { dot: string; labelKey: string }> = {
  connected: { dot: 'bg-green-500', labelKey: 'pages.app.exemplo-socket.status-conectado' },
  connecting: { dot: 'bg-yellow-500', labelKey: 'pages.app.exemplo-socket.status-conectando' },
  disconnected: { dot: 'bg-zinc-400', labelKey: 'pages.app.exemplo-socket.status-desconectado' },
  error: { dot: 'bg-red-500', labelKey: 'pages.app.exemplo-socket.status-erro' },
}

/**
 * Demonstração do socket.io-client: conexão autenticada (handshake com o
 * access token), presença ao vivo e um echo de ida e volta com o backend.
 */
export function SocketExampleSection() {
  const { socket, status, error } = useSocket()
  const [presence, setPresence] = useState<number | null>(null)
  const [reply, setReply] = useState<EchoReply | null>(null)

  const form = useForm<EchoFormValues>({ defaultValues: { message: '' } })

  useEffect(() => {
    if (!socket) return

    const onPresence = (count: number) => setPresence(count)
    const onReply = (payload: EchoReply) => setReply(payload)

    socket.on('presence:count', onPresence)
    socket.on('echo:reply', onReply)
    return () => {
      socket.off('presence:count', onPresence)
      socket.off('echo:reply', onReply)
    }
  }, [socket])

  const statusStyle = STATUS_STYLES[status]

  return (
    <section className="rounded-xl border border-divider bg-contrast p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold tracking-tight">
          {i18n('pages.app.exemplo-socket.titulo')}
        </h3>
        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <span className={cn('size-2.5 rounded-full', statusStyle.dot)} />
          {i18n(statusStyle.labelKey)}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {i18n('pages.app.exemplo-socket.descricao')}
      </p>

      {status === 'error' && error && (
        <div className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm">
          <p className="font-medium text-destructive">
            {i18n('pages.app.exemplo-socket.erro-detalhe', { message: error })}
          </p>
          <p className="mt-1 text-muted-foreground">
            {i18n('pages.app.exemplo-socket.erro-dica')}
          </p>
        </div>
      )}

      {presence !== null && (
        <p className="mt-3 text-sm">
          {i18n('pages.app.exemplo-socket.conexoes-ativas', { count: presence })}
        </p>
      )}

      <FormProvider {...form}>
        <form
          className="mt-4 flex flex-col gap-4"
          onSubmit={form.handleSubmit(({ message }) => {
            socket?.emit('echo:send', message)
            form.reset()
          })}
          noValidate
        >
          <TextField
            name="message"
            label={i18n('pages.app.exemplo-socket.campo-mensagem')}
            placeholder={i18n('pages.app.exemplo-socket.campo-mensagem-placeholder')}
            rules={validators.required()}
          />
          <Button type="submit" variant="outlined" color="purple" disabled={status !== 'connected'}>
            {i18n('pages.app.exemplo-socket.botao-enviar')}
          </Button>
        </form>
      </FormProvider>

      <div className="mt-4 rounded-lg border border-divider bg-background p-4 text-sm">
        {reply ? (
          <>
            <p className="font-medium">{i18n('pages.app.exemplo-socket.resposta')}</p>
            <p className="mt-2 text-muted-foreground">"{reply.message}"</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              userId={reply.userId} · {reply.at}
            </p>
          </>
        ) : (
          <p className="text-muted-foreground">{i18n('pages.app.exemplo-socket.sem-resposta')}</p>
        )}
      </div>
    </section>
  )
}
