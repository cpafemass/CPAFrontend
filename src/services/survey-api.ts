import type { SurveyApiPayload } from '../lib/survey-types'
import { buildApiEndpoint } from '../config/api'
import { fetchWithRetry } from '../utils/fetch-with-retry'

const SURVEY_API_ENDPOINT = buildApiEndpoint('/formulario')

interface ApiSubmitResponse {
  error?: string
  message?: string
}

export interface SubmitSurveyResult {
  ok: boolean
  status: number
  message: string
}

async function readJsonOrText(response: Response) {
  const responseText = await response.text()
  if (!responseText) return null

  try {
    return JSON.parse(responseText) as ApiSubmitResponse
  } catch {
    return { message: responseText } satisfies ApiSubmitResponse
  }
}

export async function submitSurvey(payload: SurveyApiPayload): Promise<SubmitSurveyResult> {
  let response: Response

  try {
    response = await fetchWithRetry(SURVEY_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      retries: 1,
    })
  } catch {
    return {
      ok: false,
      status: 0,
      message: 'Não foi possível conectar ao backend. A resposta não foi reenviada automaticamente para evitar duplicidade.',
    }
  }

  const responseBody = await readJsonOrText(response)
  const responseMessage = responseBody?.error ?? responseBody?.message

  if (response.ok) {
    return {
      ok: true,
      status: response.status,
      message: responseMessage || 'Avaliação enviada com sucesso.',
    }
  }

  return {
    ok: false,
    status: response.status,
    message: responseMessage || 'Não foi possível enviar a avaliação.',
  }
}
