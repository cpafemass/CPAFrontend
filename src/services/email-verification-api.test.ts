import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  EmailVerificationError,
  confirmEmailVerification,
  requestEmailVerification,
} from './email-verification-api'
import type { CatalogForm } from '../lib/survey-types'

const form: CatalogForm = {
  campaign: 'cpa-2026',
  code: 'docente_gestao',
  name: 'Docentes',
  audience: 'professor',
  version: 1,
  order: 1,
  scope: 'GERAL',
  commentAllowed: false,
  questions: [],
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('email verification API', () => {
  it('sends the institutional-email request exactly once', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ verificationId: 42 }), { status: 202 }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      requestEmailVerification('docente@femass.edu.br', 'professor', form),
    ).resolves.toEqual({ verificationId: 42 })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toContain('/verificacao-email/solicitar')
    expect(JSON.parse(String(init.body))).toEqual({
      email: 'docente@femass.edu.br',
      publico: 'professor',
      campaign: 'cpa-2026',
      form: 'docente_gestao',
      formVersion: 1,
    })
  })

  it('does not retry a failed PIN confirmation', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('network unavailable'))
    vi.stubGlobal('fetch', fetchMock)

    await expect(confirmEmailVerification(42, 'PIN-SECRETO')).rejects.toMatchObject({
      code: 'network',
      status: 0,
    } satisfies Partial<EmailVerificationError>)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('turns expiry and resend limits into safe, actionable messages', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 429 })))
    await expect(
      requestEmailVerification('docente@femass.edu.br', 'professor', form),
    ).rejects.toMatchObject({
      code: 'resend-limit',
      message: expect.stringContaining('limite de reenvios'),
    })

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 400 })))
    await expect(confirmEmailVerification(42, 'PIN-SECRETO')).rejects.toMatchObject({
      code: 'invalid-or-expired-pin',
      message: expect.stringContaining('expirou'),
    })
  })
})
