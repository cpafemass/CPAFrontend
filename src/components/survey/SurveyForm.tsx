import { useCallback, useMemo, useState } from 'react'
import { buildSurveyApiPayload } from '../../lib/survey-payload'
import type { CatalogForm, Curso, Materia, ParticipantType, Respostas, Step } from '../../lib/survey-types'
import { fetchCatalog, fetchFormCourses } from '../../services/catalog-api'
import { confirmEmailVerification, requestEmailVerification } from '../../services/email-verification-api'
import { submitSurvey, type SubmitSurveyResult } from '../../services/survey-api'
import { ConfirmationStep } from './steps/ConfirmationStep'
import { CourseStep } from './steps/CourseStep'
import { EmailVerificationStep, PinVerificationStep } from './steps/EmailVerificationStep'
import { FormSelectionStep } from './steps/FormSelectionStep'
import { ParticipantStep } from './steps/ParticipantStep'
import { QuestionnaireStep } from './steps/QuestionnaireStep'
import { SubjectStep } from './steps/SubjectStep'

const emptyResponses = (): Respostas => ({ opcoes: {}, comentario: '' })

export function SurveyForm() {
  const [step, setStep] = useState<Step>('participant')
  const [participantType, setParticipantType] = useState<ParticipantType | null>(null)
  const [cpf, setCpf] = useState(''); const [matricula, setMatricula] = useState(''); const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [forms, setForms] = useState<CatalogForm[]>([]); const [form, setForm] = useState<CatalogForm | null>(null); const [loadingForms, setLoadingForms] = useState(false); const [formError, setFormError] = useState('')
  const [email, setEmail] = useState(''); const [verificationId, setVerificationId] = useState<number | null>(null); const [submissionToken, setSubmissionToken] = useState<string | null>(null); const [verificationError, setVerificationError] = useState(''); const [verificationLoading, setVerificationLoading] = useState(false)
  const [courses, setCourses] = useState<Curso[]>([]); const [course, setCourse] = useState<Curso | null>(null); const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]); const [subjectIndex, setSubjectIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, Respostas>>({}); const [generalResponses, setGeneralResponses] = useState(emptyResponses); const [isSubmitting, setIsSubmitting] = useState(false); const [result, setResult] = useState<SubmitSurveyResult | null>(null)
  const selectedSubjects = useMemo(() => course?.materias.filter((subject) => selectedSubjectIds.includes(subject.id)) ?? [], [course, selectedSubjectIds])
  const currentSubject = selectedSubjects[subjectIndex]

  const loadForms = useCallback(async () => {
    if (!participantType) return
    setLoadingForms(true); setFormError('')
    try { setForms(await fetchCatalog(participantType)) } catch (error) { setFormError(error instanceof Error ? error.message : 'Não foi possível carregar os formulários.') } finally { setLoadingForms(false) }
  }, [participantType])
  const participantNext = async () => { await loadForms(); setStep('form') }
  const startForm = async () => {
    if (!form || !participantType) return
    if (participantType !== 'aluno' && !submissionToken) { setStep('email'); return }
    if (form.scope === 'DISCIPLINA') { try { setCourses(await fetchFormCourses(participantType)); setStep('course') } catch (error) { setFormError(error instanceof Error ? error.message : 'Não foi possível carregar os cursos.'); setStep('form') } } else setStep('questionnaire')
  }
  const requestCode = async (value: string) => {
    if (!form || !participantType || participantType === 'aluno') return
    setVerificationLoading(true); setVerificationError('')
    try { setEmail(value); setVerificationId(await requestEmailVerification(value, participantType, form)); setStep('pin') } catch (error) { setVerificationError(error instanceof Error ? error.message : 'Não foi possível solicitar a verificação.') } finally { setVerificationLoading(false) }
  }
  const resend = () => requestCode(email)
  const confirmCode = async (pin: string) => {
    if (!verificationId) return
    setVerificationLoading(true); setVerificationError('')
    try { setSubmissionToken(await confirmEmailVerification(verificationId, pin)); await startAfterVerification() } catch (error) { setVerificationError(error instanceof Error ? error.message : 'Código de verificação inválido ou expirado.') } finally { setVerificationLoading(false) }
  }
  const startAfterVerification = async () => { if (!form || !participantType) return; if (form.scope === 'DISCIPLINA') { setCourses(await fetchFormCourses(participantType)); setStep('course') } else setStep('questionnaire') }
  const submit = async () => {
    if (!form || !participantType) return
    setIsSubmitting(true)
    try { setResult(await submitSurvey(buildSurveyApiPayload({ form, participantType, acceptedTerms, cpf, matricula, emailVerificationToken: submissionToken, course, subjects: selectedSubjects, responses, generalResponses }))) } catch (error) { setResult({ ok: false, status: 0, message: error instanceof Error ? error.message : 'Não foi possível enviar a avaliação.' }) } finally { setIsSubmitting(false); setStep('confirmation') }
  }
  const reset = () => { setStep('participant'); setParticipantType(null); setCpf(''); setMatricula(''); setAcceptedTerms(false); setForm(null); setSubmissionToken(null); setVerificationId(null); setEmail(''); setCourse(null); setSelectedSubjectIds([]); setResponses({}); setGeneralResponses(emptyResponses); setResult(null) }
  const updateSubject = (subject: Materia, value: Respostas) => setResponses((current) => ({ ...current, [subject.id]: value }))

  return <main className="grid flex-1 place-items-center py-8">{step === 'participant' ? <ParticipantStep cpf={cpf} matricula={matricula} participantType={participantType} acceptedTerms={acceptedTerms} onCpfChange={setCpf} onMatriculaChange={setMatricula} onParticipantTypeChange={setParticipantType} onAcceptedTermsChange={setAcceptedTerms} onNext={() => void participantNext()} /> : null}{step === 'form' ? <FormSelectionStep forms={forms} selected={form} loading={loadingForms} error={formError} onSelect={setForm} onRetry={() => void loadForms()} onBack={() => setStep('participant')} onNext={() => void startForm()} /> : null}{step === 'email' ? <EmailVerificationStep loading={verificationLoading} error={verificationError} onBack={() => setStep('form')} onSubmit={requestCode} /> : null}{step === 'pin' ? <PinVerificationStep loading={verificationLoading} error={verificationError} onBack={() => setStep('email')} onConfirm={confirmCode} onResend={resend} /> : null}{step === 'course' ? <CourseStep cursos={courses} selectedCourseId={course?.id ?? null} onCourseSelect={(id) => { setCourse(courses.find((item) => item.id === id) ?? null); setSelectedSubjectIds([]) }} isLoading={false} error="" onRetry={() => undefined} onBack={() => setStep('form')} onNext={() => setStep('subjects')} /> : null}{step === 'subjects' && course ? <SubjectStep materias={course.materias} selectedSubjectIds={selectedSubjectIds} onSubjectToggle={(id) => setSelectedSubjectIds((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id])} onBack={() => setStep('course')} onNext={() => { setSubjectIndex(0); setStep('questionnaire') }} /> : null}{step === 'questionnaire' && form ? <QuestionnaireStep form={form} materia={form.scope === 'DISCIPLINA' ? currentSubject : undefined} respostas={form.scope === 'DISCIPLINA' && currentSubject ? responses[currentSubject.id] ?? emptyResponses() : generalResponses} onChange={(value) => currentSubject && form.scope === 'DISCIPLINA' ? updateSubject(currentSubject, value) : setGeneralResponses(value)} onBack={() => form.scope === 'DISCIPLINA' ? (subjectIndex ? setSubjectIndex(subjectIndex - 1) : setStep('subjects')) : setStep(participantType === 'aluno' ? 'form' : 'pin')} onNext={() => { if (form.scope === 'DISCIPLINA' && subjectIndex < selectedSubjects.length - 1) setSubjectIndex(subjectIndex + 1); else void submit() }} isSubmitting={isSubmitting} isLast={form.scope !== 'DISCIPLINA' || subjectIndex === selectedSubjects.length - 1} /> : null}{step === 'confirmation' ? <ConfirmationStep participantType={participantType} submitResult={result} totalMaterias={selectedSubjects.length} onNewResponse={reset} /> : null}</main>
}
