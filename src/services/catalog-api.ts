import type { CatalogForm, Curso, ParticipantType } from '../lib/survey-types'
import { buildApiEndpoint } from '../config/api'
import { fetchWithRetry } from '../utils/fetch-with-retry'

const campaign = import.meta.env.VITE_CPA_CAMPAIGN?.trim() || 'cpa-2026'
interface ApiDisciplina { id: number; nome: string; professor: string }
interface ApiCurso { id: number; nome: string; disciplinas: ApiDisciplina[] }

async function responseMessage(response: Response) {
  const text = await response.text()
  try { const body = JSON.parse(text) as { error?: string; message?: string }; return body.error ?? body.message ?? text } catch { return text }
}

export async function fetchCatalog(participantType: ParticipantType): Promise<CatalogForm[]> {
  const query = new URLSearchParams({ campaign, publico: participantType })
  const response = await fetchWithRetry(buildApiEndpoint(`/formularios?${query}`))
  if (!response.ok) throw new Error((await responseMessage(response)) || 'Não foi possível carregar os formulários.')
  return await response.json() as CatalogForm[]
}

export async function fetchFormCourses(participantType: ParticipantType): Promise<Curso[]> {
  const query = new URLSearchParams({ campaign, publico: participantType })
  const response = await fetchWithRetry(buildApiEndpoint(`/dados-formulario?${query}`))
  if (!response.ok) throw new Error((await responseMessage(response)) || 'Não foi possível carregar cursos e disciplinas.')
  const body = await response.json() as { cursos: ApiCurso[] }
  return body.cursos.map((curso) => ({ id: String(curso.id), nome: curso.nome, materias: curso.disciplinas.map((disciplina) => ({ id: String(disciplina.id), nome: disciplina.nome, docente: disciplina.professor })) }))
}
