import type { ParticipantType } from "../../../lib/survey-types";
import type { SubmitSurveyResult } from "../../../services/survey-api";
import { Button } from "../ui/Button";

interface Props {
  participantType: ParticipantType | null;
  submitResult: SubmitSurveyResult | null;
  totalMaterias: number;
  onNewResponse: () => void;
}
export function ConfirmationStep({
  participantType,
  submitResult,
  totalMaterias,
  onNewResponse,
}: Props) {
  const ok = submitResult?.ok;
  return (
    <section className="survey-enter w-full max-w-xl px-4 text-center">
      <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/10">
        <h1 className="text-3xl font-black text-slate-950">
          {ok ? "Avaliação enviada" : "Não foi possível enviar a avaliação"}
        </h1>
        <p className="mt-4 text-slate-600">
          {submitResult?.message ??
            "Aguarde enquanto processamos sua resposta."}
        </p>
        {ok && totalMaterias > 0 ? (
          <p className="mt-2 text-sm text-slate-500">
            {totalMaterias}{" "}
            {totalMaterias === 1
              ? "disciplina avaliada."
              : "disciplinas avaliadas."}
          </p>
        ) : null}
        {participantType !== "aluno" ? (
          <p className="mt-4 text-sm text-slate-500">
            Nenhum e-mail, código ou identificador foi exibido nesta
            confirmação.
          </p>
        ) : null}
        <Button className="mt-6" onClick={onNewResponse}>
          Nova resposta
        </Button>
      </div>
    </section>
  );
}
