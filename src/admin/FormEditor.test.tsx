import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { FormEditor } from './FormsPage'
import type { FormInput } from './types'

const initial: FormInput = { codigo: 'geral', nome: 'Avaliação', publico: 'aluno', escopo: 'GERAL', ordem: 1, commentAllowed: false, commentNotice: null, perguntas: [{ id: 10, codigo: 'q1', texto: 'Pergunta', ordem: 1, ativo: true, opcoes: [{ id: 20, code: 'sim', label: 'Sim', value: 1, naoSeiResponder: false, ativo: true }] }] }
afterEach(cleanup)
describe('editor de formulários', () => {
  it('desativa itens preservando ids no envio do rascunho', async () => {
    const save = vi.fn().mockResolvedValue(undefined)
    render(<FormEditor initial={initial} busy={false} onSave={save} />)
    fireEvent.click(screen.getAllByLabelText('Ativa')[0])
    fireEvent.click(screen.getByRole('button', { name: 'Salvar rascunho' }))
    await waitFor(() => expect(save).toHaveBeenCalledOnce())
    expect(save.mock.calls[0][0].perguntas[0]).toMatchObject({ id: 10, codigo: 'q1', ativo: false, opcoes: [{ id: 20, ativo: true }] })
  })
  it('exibe versões publicadas somente para leitura', () => {
    render(<FormEditor initial={initial} readOnly busy={false} onSave={vi.fn()} />)
    expect(screen.getByLabelText('Texto')).toBeDisabled()
    expect(screen.getAllByLabelText('Ativa')[0]).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Salvar rascunho' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Adicionar pergunta' })).not.toBeInTheDocument()
  })
  it('transforma não sei responder em valor nulo', async () => {
    const save = vi.fn().mockResolvedValue(undefined)
    render(<FormEditor initial={initial} busy={false} onSave={save} />)
    fireEvent.click(screen.getByLabelText('Não sei responder'))
    expect(screen.getByLabelText('Valor')).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Salvar rascunho' }))
    await waitFor(() => expect(save).toHaveBeenCalledOnce())
    expect(save.mock.calls[0][0].perguntas[0].opcoes[0]).toMatchObject({ value: null, naoSeiResponder: true })
  })
})
