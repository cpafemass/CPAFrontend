import { buildApiEndpoint } from '../config/api'
import { fetchWithRetry } from '../utils/fetch-with-retry'
import type { CatalogForm, ParticipantType } from '../lib/survey-types'

async function messageFor(response: Response) {
  const text = await response.text()
  try { const body = JSON.parse(text) as { error?: string; message?: string }; return body.error ?? body.message ?? text } catch { return text }
}

export async function requestEmailVerification(email: string, participantType: Exclude<ParticipantType, 'aluno'>, form: CatalogForm) {
  const response = await fetchWithRetry(buildApiEndpoint('/verificacao-email/solicitar'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, publico: participantType, campaign: form.campaign, form: form.code, formVersion: form.version }) })
  if (!response.ok) throw new Error((await messageFor(response)) || 'Não foi possível solicitar a verificação.')
  return (await response.json() as { verificationId: number }).verificationId
}

export async function confirmEmailVerification(verificationId: number, pin: string) {
  const response = await fetchWithRetry(buildApiEndpoint('/verificacao-email/confirmar'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ verificationId, pin }) })
  if (!response.ok) throw new Error((await messageFor(response)) || 'Código de verificação inválido ou expirado.')
  return (await response.json() as { submissionToken: string }).submissionToken
}
