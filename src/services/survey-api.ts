import type { SurveyApiPayload } from '../lib/survey-types'

const SURVEY_API_ENDPOINT =
  import.meta.env.VITE_SURVEY_API_ENDPOINT ?? 'http://localhost:8080/formulario'

export async function submitSurvey(payload: SurveyApiPayload) {
  const response = await fetch(SURVEY_API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const responseBody = await response.text()
    const details = responseBody ? ` Detalhes: ${responseBody}` : ''
    throw new Error(`Não foi possível enviar a avaliação.${details}`)
  }
}
