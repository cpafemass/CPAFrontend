export type ParticipantType = 'aluno' | 'professor' | 'funcionario'

export type QuestionId = string
export type FormScope = 'DISCIPLINA' | 'GERAL'

export interface CatalogOption {
  code: string
  label: string
  naoSeiResponder?: boolean
}

export interface Pergunta {
  id: QuestionId
  texto: string
  ordem?: number
  options: CatalogOption[]
}

export interface CatalogForm {
  campaign: string
  code: string
  name: string
  audience: ParticipantType
  version: number
  order: number
  scope: FormScope
  commentAllowed: boolean
  commentNotice?: string
  questions: Pergunta[]
}

export interface Materia { id: string; nome: string; docente: string }
export interface Curso { id: string; nome: string; materias: Materia[] }
export interface Respostas { opcoes: Record<QuestionId, string>; comentario: string }
export interface SurveyApiAnswer { questionId: QuestionId; optionCode: string }
export interface SurveyApiSubject { subjectId: string; subjectName: string; teacherName: string; answers: SurveyApiAnswer[]; comment?: string }

export interface SurveyApiPayload {
  campaign: string
  form: string
  formVersion: number
  submittedAt: string
  respondent: { type: ParticipantType; aceiteTermosCondicoesServico: boolean; cpf?: string; matricula?: string; emailVerificationToken?: string }
  course?: { id?: string; name: string }
  subjects?: SurveyApiSubject[]
  answers?: SurveyApiAnswer[]
  comment?: string
}

export type Step = 'participant' | 'form' | 'email' | 'pin' | 'course' | 'subjects' | 'questionnaire' | 'confirmation'
