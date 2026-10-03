import { describe, expect, it } from 'vitest'
import { buildSurveyApiPayload } from './survey-payload'
import type { CatalogForm } from './survey-types'

const form: CatalogForm = {
  campaign: 'cpa-2026',
  code: 'discente_gestao',
  name: 'Gestão',
  audience: 'aluno',
  version: 3,
  order: 1,
  scope: 'GERAL',
  commentAllowed: true,
  questions: [
    {
      id: 'q-obrigatoria',
      texto: 'Obrigatória',
      options: [
        { code: 'nao_sei_responder', label: 'Não sei responder', naoSeiResponder: true },
      ],
    },
    {
      id: 'q-opcional',
      texto: 'Opcional',
      required: false,
      options: [{ code: 'concordo', label: 'Concordo' }],
    },
    {
      id: 'q-inativa',
      texto: 'Inativa',
      active: false,
      options: [{ code: 'ignorar', label: 'Ignorar' }],
    },
  ],
}

describe('buildSurveyApiPayload', () => {
  it('references the form version and sends only valid active answers', () => {
    const payload = buildSurveyApiPayload({
      form,
      participantType: 'aluno',
      acceptedTerms: true,
      cpf: '529.982.247-25',
      matricula: ' A-01 ',
      emailVerificationToken: null,
      course: null,
      subjects: [],
      responses: {},
      generalResponses: {
        opcoes: {
          'q-obrigatoria': 'nao_sei_responder',
          'q-opcional': 'opcao-invalida',
          'q-inativa': 'ignorar',
        },
        comentario: ' Comentário livre ',
      },
    })

    expect(payload).toMatchObject({
      campaign: 'cpa-2026',
      form: 'discente_gestao',
      formVersion: 3,
      comment: 'Comentário livre',
      respondent: { cpf: '52998224725', matricula: 'A-01' },
    })
    expect(payload.answers).toEqual([
      { questionId: 'q-obrigatoria', optionCode: 'nao_sei_responder' },
    ])
  })
})
