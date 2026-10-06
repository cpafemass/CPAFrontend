import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { EmailVerificationStep } from './EmailVerificationStep'

describe('EmailVerificationStep', () => {
  it('bloqueia identificador institucional numerico antes do envio', () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(
      <EmailVerificationStep
        onBack={() => undefined}
        onSubmit={onSubmit}
        loading={false}
        error=""
      />,
    )

    fireEvent.change(screen.getByLabelText('E-mail institucional'), {
      target: { value: '2301130025@femass.edu.br' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Enviar código' }))

    expect(screen.getByRole('alert')).toHaveTextContent('sem matrícula antes do @')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('permite e-mail institucional nominal', () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(
      <EmailVerificationStep
        onBack={() => undefined}
        onSubmit={onSubmit}
        loading={false}
        error=""
      />,
    )

    fireEvent.change(screen.getByLabelText('E-mail institucional'), {
      target: { value: 'nome.sobrenome@femass.edu.br' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Enviar código' }))

    expect(onSubmit).toHaveBeenCalledWith('nome.sobrenome@femass.edu.br')
  })
})
