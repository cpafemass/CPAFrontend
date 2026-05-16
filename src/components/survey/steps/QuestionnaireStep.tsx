import { escalaAvaliacao, perguntas, textoIntrodutorioAvaliacao } from '../../../lib/survey-data'
import type { Materia, Respostas } from '../../../lib/survey-types'
import { Actions } from '../ui/Actions'
import { Button } from '../ui/Button'
import { IconBadge } from '../ui/IconBadge'
import { RatingScale } from '../ui/RatingScale'

interface QuestionnaireStepProps {
  materia: Materia
  respostas: Respostas
  onRespostasChange: (respostas: Respostas) => void
  currentIndex: number
  totalMaterias: number
  onPrevious: () => void
  onNext: () => void
  isLast: boolean
  isSubmitting: boolean
  submitError: string
}

export function QuestionnaireStep({
  materia,
  respostas,
  onRespostasChange,
  currentIndex,
  totalMaterias,
  onPrevious,
  onNext,
  isLast,
  isSubmitting,
  submitError,
}: QuestionnaireStepProps) {
  const allFieldsAnswered =
    perguntas.every((pergunta) => respostas[pergunta.id] > 0) &&
    respostas.comentario.trim().length > 0

  const handleRatingChange = (key: keyof Respostas, value: number) => {
    onRespostasChange({ ...respostas, [key]: value })
  }

  return (
    <section className="survey-enter w-full max-w-2xl px-4">
      <div className="mb-6 text-center">
        <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
          Disciplina {currentIndex + 1} de {totalMaterias}
        </span>
        <h2 className="mt-4 text-3xl font-black text-slate-950 sm:text-4xl">Avaliação da Disciplina</h2>
      </div>

      <div className="mb-6 grid gap-7 rounded-lg border border-slate-200 bg-white/95 p-6 shadow-xl shadow-slate-900/10 sm:p-8">
        <div className="flex items-start gap-3 border-b border-slate-200 pb-5">
          <IconBadge>MAT</IconBadge>
          <div>
            <h3 className="text-xl font-black text-slate-950">{materia.nome}</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">{materia.docente}</p>
          </div>
        </div>

        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm leading-relaxed text-slate-700">
          <p>{textoIntrodutorioAvaliacao}</p>
          <dl className="mt-3 grid gap-1 sm:grid-cols-5">
            {escalaAvaliacao.map((item) => (
              <div className="rounded-md bg-white/70 p-2" key={item.valor}>
                <dt className="font-black text-blue-700">{item.valor}</dt>
                <dd className="text-xs font-semibold">{item.rotulo}</dd>
              </div>
            ))}
          </dl>
        </div>

        {perguntas.map((pergunta) => (
          <RatingScale
            key={pergunta.id}
            label={pergunta.texto}
            value={respostas[pergunta.id]}
            onChange={(value) => handleRatingChange(pergunta.id, value)}
          />
        ))}

        <label className="grid gap-3 border-t border-slate-200 pt-5 text-sm font-bold text-slate-700">
          Comentários adicionais
          <textarea
            className="min-h-28 resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-normal text-slate-950 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
            placeholder="Deixe aqui seus comentários, sugestões ou observações sobre a disciplina..."
            value={respostas.comentario}
            onChange={(event) =>
              onRespostasChange({ ...respostas, comentario: event.target.value })
            }
          />
        </label>
      </div>

      <Actions>
        <Button variant="secondary" onClick={onPrevious}>
          {currentIndex === 0 ? 'Voltar' : 'Disciplina Anterior'}
        </Button>
        <Button disabled={!allFieldsAnswered || isSubmitting} onClick={onNext}>
          {isSubmitting ? 'Enviando...' : isLast ? 'Finalizar Pesquisa' : 'Próxima Disciplina'}
        </Button>
      </Actions>
      {!allFieldsAnswered ? (
        <p className="mt-4 text-center text-sm font-medium text-slate-500">Responda todas as afirmações e preencha os comentários para continuar</p>
      ) : null}
      {submitError ? (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm font-bold text-red-700">
          {submitError}
        </p>
      ) : null}
    </section>
  )
}
