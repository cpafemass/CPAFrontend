import { afterEach, describe, expect, it, vi } from 'vitest'
import { submitSurvey } from './survey-api'
import type { SurveyApiPayload } from '../lib/survey-types'

const payload: SurveyApiPayload = {
  campaign: 'cpa-2026',
  form: 'discente_gestao',
  formVersion: 1,
  submittedAt: '2026-10-03T12:00:00.000Z',
  respondent: { type: 'aluno', aceiteTermosCondicoesServico: true },
  answers: [{ questionId: 'q1', optionCode: 'concordo_totalmente' }],
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('submitSurvey', () => {
  it('posts an anonymous response exactly once', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(submitSurvey(payload)).resolves.toMatchObject({ ok: true, status: 200 })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    const body = JSON.parse(String(init.body))
    expect(body.respondent).toEqual({ type: 'aluno', aceiteTermosCondicoesServico: true })
    expect(JSON.stringify(body)).not.toMatch(/cpf|matricula|pin/i)
  })

  it('does not replay a submission after a network failure', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('network unavailable'))
    vi.stubGlobal('fetch', fetchMock)

    await expect(submitSurvey(payload)).resolves.toMatchObject({ ok: false, status: 0 })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
