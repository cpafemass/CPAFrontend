import { describe, expect, it } from 'vitest'
import { normalizeCatalog } from './survey-catalog'

describe('normalizeCatalog', () => {
  it('keeps only active entries and follows the configured order', () => {
    const catalog = normalizeCatalog([
      {
        campaign: 'cpa-2026',
        code: 'gestao',
        name: 'Gestão',
        audience: 'aluno',
        version: 2,
        order: 2,
        scope: 'GERAL',
        commentAllowed: true,
        commentRequired: true,
        questions: [
          {
            id: 'q2',
            texto: 'Segunda questão',
            ordem: 2,
            required: false,
            options: [
              { code: 'concordo', label: 'Concordo', ordem: 2 },
              { code: 'nao-sei', label: 'Não sei responder', ordem: 1, naoSeiResponder: true },
            ],
          },
          {
            id: 'q-inativa',
            texto: 'Não renderizar',
            ordem: 1,
            active: false,
            options: [{ code: 'a', label: 'A' }],
          },
        ],
      },
      {
        campaign: 'cpa-2026',
        code: 'disciplina',
        name: 'Disciplina',
        audience: 'aluno',
        version: 1,
        order: 1,
        scope: 'DISCIPLINA',
        commentAllowed: false,
        questions: [{ id: 'q1', texto: 'Pergunta', options: [{ code: 'a', label: 'A' }] }],
      },
      {
        campaign: 'cpa-2026',
        code: 'inativo',
        name: 'Inativo',
        audience: 'aluno',
        version: 1,
        order: 3,
        scope: 'GERAL',
        commentAllowed: false,
        active: false,
        questions: [{ id: 'q1', texto: 'Pergunta', options: [{ code: 'a', label: 'A' }] }],
      },
    ])

    expect(catalog.map((form) => form.code)).toEqual(['disciplina', 'gestao'])
    expect(catalog[1].commentRequired).toBe(true)
    expect(catalog[1].questions.map((question) => question.id)).toEqual(['q2'])
    expect(catalog[1].questions[0].required).toBe(false)
    expect(catalog[1].questions[0].options.map((option) => option.code)).toEqual([
      'nao-sei',
      'concordo',
    ])
  })

  it('rejects malformed forms instead of rendering an ambiguous survey', () => {
    expect(() => normalizeCatalog([{ code: 'sem-campanha' }])).toThrow(
      'O catálogo possui um formulário sem perguntas.',
    )
  })
})
