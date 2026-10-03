import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { CatalogForm, Respostas } from '../../../lib/survey-types'
import { QuestionnaireStep } from './QuestionnaireStep'

const form: CatalogForm = {
  campaign: 'cpa-2026',
  code: 'teste',
  name: 'Formulário de teste',
  audience: 'aluno',
  version: 1,
  order: 1,
  scope: 'GERAL',
  commentAllowed: true,
  commentRequired: true,
  questions: [
    {
      id: 'obrigatoria',
      texto: 'Pergunta obrigatória',
      options: [{ code: 'sim', label: 'Sim' }],
    },
    {
      id: 'opcional',
      texto: 'Pergunta opcional',
      required: false,
      options: [{ code: 'talvez', label: 'Talvez' }],
    },
  ],
}

function renderStep(respostas: Respostas, onChange = vi.fn()) {
  return render(
    <QuestionnaireStep
      form={form}
      respostas={respostas}
      onChange={onChange}
      onBack={vi.fn()}
      onNext={vi.fn()}
      isSubmitting={false}
      isLast
      isFinalJourney
    />,
  )
}

describe('QuestionnaireStep', () => {
  it('requires only configured questions and the configured comment', () => {
    const onChange = vi.fn()
    const { rerender } = renderStep({ opcoes: {}, comentario: '' }, onChange)

    expect(
      (screen.getByRole('button', { name: 'Finalizar Pesquisa' }) as HTMLButtonElement)
        .disabled,
    ).toBe(true)
    expect(screen.getByText('Resposta opcional.')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Sim' }))
    expect(onChange).toHaveBeenCalledWith({
      opcoes: { obrigatoria: 'sim' },
      comentario: '',
    })

    rerender(
      <QuestionnaireStep
        form={form}
        respostas={{ opcoes: { obrigatoria: 'sim' }, comentario: '' }}
        onChange={onChange}
        onBack={vi.fn()}
        onNext={vi.fn()}
        isSubmitting={false}
        isLast
        isFinalJourney
      />,
    )
    expect(
      (screen.getByRole('button', { name: 'Finalizar Pesquisa' }) as HTMLButtonElement)
        .disabled,
    ).toBe(true)

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Comentário' } })
    expect(onChange).toHaveBeenLastCalledWith({
      opcoes: { obrigatoria: 'sim' },
      comentario: 'Comentário',
    })

    rerender(
      <QuestionnaireStep
        form={form}
        respostas={{ opcoes: { obrigatoria: 'sim' }, comentario: 'Comentário' }}
        onChange={onChange}
        onBack={vi.fn()}
        onNext={vi.fn()}
        isSubmitting={false}
        isLast
        isFinalJourney
      />,
    )
    expect(
      (screen.getByRole('button', { name: 'Finalizar Pesquisa' }) as HTMLButtonElement)
        .disabled,
    ).toBe(false)
  })
})
