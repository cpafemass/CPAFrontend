import type { Curso } from "../../../lib/survey-types";
import { Actions } from "../ui/Actions";
import { Button } from "../ui/Button";
import { LoadingState } from "../ui/LoadingState";
import { OptionButton } from "../ui/OptionButton";
import { StepTitle } from "../ui/StepTitle";

interface CourseStepProps {
  cursos: Curso[];
  selectedCourseId: string | null;
  onCourseSelect: (courseId: Curso["id"]) => void;
  isLoading: boolean;
  error: string;
  onRetry: () => void;
  onNext: () => void;
  onBack: () => void;
}

export function CourseStep({
  cursos,
  selectedCourseId,
  onCourseSelect,
  isLoading,
  error,
  onRetry,
  onNext,
  onBack,
}: CourseStepProps) {
  return (
    <section className="survey-enter w-full max-w-2xl px-4">
      <StepTitle
        title="Selecione seu Curso"
        subtitle="Escolha o curso ao qual você pertence para visualizar as disciplinas disponíveis."
      />

      {isLoading ? (
        <div className="mb-7">
          <LoadingState message="Conectando ao backend para carregar cursos e disciplinas..." />
        </div>
      ) : null}

      {error ? (
        <div className="mb-7 rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-bold text-red-700">{error}</p>
          <Button className="mt-4" onClick={onRetry}>
            Tentar novamente
          </Button>
        </div>
      ) : null}

      {!isLoading && !error ? (
        <div className="mb-7 grid gap-3">
          {cursos.map((curso) => (
            <OptionButton
              icon="CUR"
              key={curso.id}
              selected={selectedCourseId === curso.id}
              title={curso.nome}
              subtitle={`${curso.materias.length} ${curso.materias.length === 1 ? "disciplina" : "disciplinas"} disponíveis`}
              onClick={() => onCourseSelect(curso.id)}
            />
          ))}
        </div>
      ) : null}

      {!isLoading && !error && cursos.length === 0 ? (
        <div className="mb-7 rounded-lg border border-slate-200 bg-white/80 p-6 text-center text-sm font-medium text-slate-500">
          Nenhum curso disponível no momento.
        </div>
      ) : null}

      <Actions>
        <Button variant="secondary" onClick={onBack}>
          Voltar
        </Button>
        <Button
          disabled={!selectedCourseId || isLoading || Boolean(error)}
          onClick={onNext}
        >
          Próximo
        </Button>
      </Actions>
    </section>
  );
}
