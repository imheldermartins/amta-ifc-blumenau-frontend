import { useCallback, useMemo, useState } from 'react'

export interface DialogControl {
  isOpen: boolean
  openDialog: () => void
  closeDialog: () => void
  /**
   * Par controlado do `<Modal>`. Espalhe: `<Modal {...dialog.dialogProps}>` —
   * assim o `open` do componente e o `isOpen` daqui não têm como divergir.
   */
  dialogProps: {
    open: boolean
    onOpenChange: (open: boolean) => void
  }
}

/**
 * Estado de abertura de uma `<Modal>`.
 *
 * Existe para o caso comum (um gatilho abre, o conteúdo é decidido em tempo de
 * escrita) ficar em duas linhas. O fechar NÃO precisa de `closeDialog`: ESC,
 * clique fora e o "X" do header passam pelo `onOpenChange` sozinhos — o método
 * é para fechar por regra sua (ex.: depois de salvar um formulário).
 *
 * Uma modal por hook. Duas modais na mesma tela = duas chamadas, cada uma com
 * seu estado.
 *
 * @example
 * const workspaceDialog = useDialog()
 * <Button onClick={workspaceDialog.openDialog}>Abrir</Button>
 * <Modal {...workspaceDialog.dialogProps} accessibleTitle={i18n('...')}>...</Modal>
 */
export function useDialog(initialOpen = false): DialogControl {
  const [isOpen, setIsOpen] = useState(initialOpen)

  const openDialog = useCallback(() => setIsOpen(true), [])
  const closeDialog = useCallback(() => setIsOpen(false), [])

  return useMemo(
    () => ({
      isOpen,
      openDialog,
      closeDialog,
      // `setIsOpen` já é estável entre renders (useState), então serve direto.
      dialogProps: { open: isOpen, onOpenChange: setIsOpen },
    }),
    [isOpen, openDialog, closeDialog],
  )
}
