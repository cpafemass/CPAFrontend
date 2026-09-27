import type { CatalogForm, Curso, Materia, ParticipantType, Respostas, SurveyApiAnswer, SurveyApiPayload } from './survey-types'

function answersFor(form: CatalogForm, respostas: Respostas): SurveyApiAnswer[] {
  return form.questions.map((question) => ({ questionId: question.id, optionCode: respostas.opcoes[question.id] }))
}

interface BuildPayloadInput {
  form: CatalogForm; participantType: ParticipantType; acceptedTerms: boolean; cpf: string; matricula: string
  emailVerificationToken: string | null; course: Curso | null; subjects: Materia[]
  responses: Record<string, Respostas>; generalResponses: Respostas
}

export function buildSurveyApiPayload(input: BuildPayloadInput): SurveyApiPayload {
  const respondent: SurveyApiPayload['respondent'] = { type: input.participantType, aceiteTermosCondicoesServico: input.acceptedTerms }
  if (input.participantType === 'aluno') {
    respondent.cpf = input.cpf.replace(/\D/g, '')
    respondent.matricula = input.matricula.trim()
  } else if (input.emailVerificationToken) respondent.emailVerificationToken = input.emailVerificationToken
  const payload: SurveyApiPayload = { campaign: input.form.campaign, form: input.form.code, formVersion: input.form.version, submittedAt: new Date().toISOString(), respondent }
  if (input.form.scope === 'DISCIPLINA' && input.course) {
    payload.course = { id: input.course.id, name: input.course.nome }
    payload.subjects = input.subjects.map((subject) => {
      const respostas = input.responses[subject.id]
      return { subjectId: subject.id, subjectName: subject.nome, teacherName: subject.docente, answers: answersFor(input.form, respostas), ...(input.form.commentAllowed && respostas.comentario.trim() ? { comment: respostas.comentario.trim() } : {}) }
    })
  } else {
    payload.answers = answersFor(input.form, input.generalResponses)
    if (input.form.commentAllowed && input.generalResponses.comentario.trim()) payload.comment = input.generalResponses.comentario.trim()
  }
  return payload
}
