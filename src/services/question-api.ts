import type { Pergunta } from '../lib/survey-types'
import { buildApiEndpoint } from '../config/api'
import { fetchWithRetry } from '../utils/fetch-with-retry'

const QUESTION_API_ENDPOINT = buildApiEndpoint('/perguntas')

interface ApiQuestion {
  id: string
  texto: string
  options?: Array<{ code: string; label: string; naoSeiResponder?: boolean }>
}

interface ApiErrorResponse {
  error?: string
  message?: string
}

async function readResponseMessage(response: Response) {
  const responseText = await response.text()
  if (!responseText) return ''

  try {
    const responseBody = JSON.parse(responseText) as ApiErrorResponse
    return responseBody.error ?? responseBody.message ?? responseText
  } catch {
    return responseText
  }
}

function mapApiQuestion(apiQuestion: ApiQuestion): Pergunta {
  return {
    id: apiQuestion.id,
    texto: apiQuestion.texto,
    options: apiQuestion.options ?? [],
  }
}

export async function fetchQuestions(): Promise<Pergunta[]> {
  let response: Response

  try {
    response = await fetchWithRetry(QUESTION_API_ENDPOINT)
  } catch {
    throw new Error('Não foi possível conectar ao backend após 3 tentativas.')
  }

  if (!response.ok) {
    const responseMessage = await readResponseMessage(response)
    throw new Error(responseMessage || 'Não foi possível carregar as perguntas.')
  }

  const questions = await response.json() as ApiQuestion[]
  if (questions.length === 0) {
    throw new Error('Nenhuma pergunta foi retornada pelo backend.')
  }

  return questions.map(mapApiQuestion)
}
