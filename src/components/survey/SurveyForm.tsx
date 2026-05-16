import { useCallback, useMemo, useState } from 'react'
import {
  cursos,
  defaultRespostas,
} from '../../lib/survey-data'
import type {
  Curso,
  MateriaResposta,
  ParticipantType,
  Respostas,
  Step,
  SurveyData,
} from '../../lib/survey-types'
import { buildSurveyApiPayload } from '../../lib/survey-payload'
import { submitSurvey } from '../../services/survey-api'
import { ConfirmationStep } from './steps/ConfirmationStep'
import { CourseStep } from './steps/CourseStep'
import { ParticipantStep } from './steps/ParticipantStep'
import { QuestionnaireStep } from './steps/QuestionnaireStep'
import { SubjectStep } from './steps/SubjectStep'
import { SurveyProgress } from './SurveyProgress'
import { stepLabels } from './survey-steps'

const stepMap: Record<Step, string> = {
  participant: 'Identificação',
  course: 'Curso',
  subjects: 'Disciplinas',
  questionnaire: 'Avaliação',
  confirmation: 'Conclusão',
}

function generateConfirmationCode() {
  const code = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, '0')

  return `CPA-2026-${code}`
}

export function SurveyForm() {
  const [currentStep, setCurrentStep] = useState<Step>('participant')
  const [cpf, setCpf] = useState('')
  const [matricula, setMatricula] = useState('')
  const [participantType, setParticipantType] = useState<ParticipantType | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([])
  const [currentQuestionnaireIndex, setCurrentQuestionnaireIndex] = useState(0)
  const [respostasMap, setRespostasMap] = useState<Record<string, Respostas>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [confirmationCode, setConfirmationCode] = useState('')

  const selectedCourse = useMemo(
    () => cursos.find((curso) => curso.id === selectedCourseId) ?? null,
    [selectedCourseId],
  )

  const selectedMaterias = useMemo(
    () => selectedCourse?.materias.filter((materia) => selectedSubjectIds.includes(materia.id)) ?? [],
    [selectedCourse, selectedSubjectIds],
  )

  const currentMateria = selectedMaterias[currentQuestionnaireIndex] ?? null

  const handleCourseSelect = useCallback((courseId: Curso['id']) => {
    setSelectedCourseId(courseId)
    setSelectedSubjectIds([])
    setRespostasMap({})
    setCurrentQuestionnaireIndex(0)
  }, [])

  const handleSubjectToggle = useCallback((subjectId: string) => {
    setSubmitError('')
    setSelectedSubjectIds((previous) =>
      previous.includes(subjectId)
        ? previous.filter((id) => id !== subjectId)
        : [...previous, subjectId],
    )
  }, [])

  const buildSurveyData = useCallback((code: string): SurveyData | null => {
    if (!selectedCourse || !participantType) return null

    const materias: MateriaResposta[] = selectedMaterias.map((materia) => ({
      idMateria: materia.id,
      nomeMateria: materia.nome,
      docente: materia.docente,
      respostas: respostasMap[materia.id] ?? defaultRespostas,
    }))

    return {
      cpf,
      matricula,
      participante: participantType,
      curso: {
        idCurso: selectedCourse.id,
        nomeCurso: selectedCourse.nome,
      },
      materias,
      confirmationCode: code,
      submittedAt: new Date().toISOString(),
    }
  }, [cpf, matricula, participantType, respostasMap, selectedCourse, selectedMaterias])

  const handleSubmit = useCallback(async () => {
    const nextConfirmationCode = generateConfirmationCode()
    setIsSubmitting(true)
    setSubmitError('')
    const payload = buildSurveyData(nextConfirmationCode)
    if (!payload) {
      setSubmitError('Não foi possível montar os dados da pesquisa.')
      setIsSubmitting(false)
      return
    }

    try {
      await submitSurvey(buildSurveyApiPayload(payload))
      setConfirmationCode(nextConfirmationCode)
      setCurrentStep('confirmation')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Não foi possível enviar a avaliação.')
    } finally {
      setIsSubmitting(false)
    }
  }, [buildSurveyData])

  const resetForm = useCallback(() => {
    setCurrentStep('participant')
    setCpf('')
    setMatricula('')
    setParticipantType(null)
    setSelectedCourseId(null)
    setSelectedSubjectIds([])
    setCurrentQuestionnaireIndex(0)
    setRespostasMap({})
    setSubmitError('')
    setConfirmationCode('')
  }, [])

  const stepNumber = stepLabels.findIndex((label) => label === stepMap[currentStep]) + 1

  return (
    <>
      {currentStep !== 'confirmation' ? <SurveyProgress currentStep={stepNumber} /> : null}

      <main className="grid flex-1 place-items-center px-0 py-8">
        {currentStep === 'participant' ? (
          <ParticipantStep
            cpf={cpf}
            matricula={matricula}
            participantType={participantType}
            onCpfChange={setCpf}
            onMatriculaChange={setMatricula}
            onParticipantTypeChange={setParticipantType}
            onNext={() => setCurrentStep('course')}
          />
        ) : null}

        {currentStep === 'course' ? (
          <CourseStep
            selectedCourseId={selectedCourseId}
            onCourseSelect={handleCourseSelect}
            onNext={() => setCurrentStep('subjects')}
            onBack={() => setCurrentStep('participant')}
          />
        ) : null}

        {currentStep === 'subjects' && selectedCourse ? (
          <SubjectStep
            materias={selectedCourse.materias}
            selectedSubjectIds={selectedSubjectIds}
            onSubjectToggle={handleSubjectToggle}
            onNext={() => {
              setCurrentQuestionnaireIndex(0)
              setCurrentStep('questionnaire')
            }}
            onBack={() => setCurrentStep('course')}
          />
        ) : null}

        {currentStep === 'questionnaire' && currentMateria ? (
          <QuestionnaireStep
            materia={currentMateria}
            respostas={respostasMap[currentMateria.id] ?? defaultRespostas}
            onRespostasChange={(respostas) => {
              setSubmitError('')
              setRespostasMap((previous) => ({ ...previous, [currentMateria.id]: respostas }))
            }}
            currentIndex={currentQuestionnaireIndex}
            totalMaterias={selectedMaterias.length}
            onPrevious={() => {
              if (currentQuestionnaireIndex === 0) setCurrentStep('subjects')
              else setCurrentQuestionnaireIndex((previous) => previous - 1)
            }}
            onNext={() => {
              if (currentQuestionnaireIndex < selectedMaterias.length - 1) {
                setCurrentQuestionnaireIndex((previous) => previous + 1)
              } else {
                void handleSubmit()
              }
            }}
            isLast={currentQuestionnaireIndex === selectedMaterias.length - 1}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        ) : null}

        {currentStep === 'confirmation' ? (
          <ConfirmationStep
            cpf={cpf}
            matricula={matricula}
            confirmationCode={confirmationCode}
            totalMaterias={selectedMaterias.length}
            onNewResponse={resetForm}
          />
        ) : null}
      </main>
    </>
  )
}
