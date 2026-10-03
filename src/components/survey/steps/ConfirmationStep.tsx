import type { SubmitSurveyResult } from "../../../services/survey-api";
import { Button } from "../ui/Button";
import { QRCodeImage } from "../ui/QRCodeImage";

interface Props {
  submitResult: SubmitSurveyResult | null;
  completedScopes: string[];
  lastCompletedSubjects: number;
  onNewResponse: () => void;
}
export function ConfirmationStep({
  submitResult,
  completedScopes,
  lastCompletedSubjects,
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
        {ok && lastCompletedSubjects > 0 ? (
          <p className="mt-2 text-sm text-slate-500">
            {lastCompletedSubjects}{" "}
            {lastCompletedSubjects === 1
              ? "disciplina avaliada."
              : "disciplinas avaliadas."}
          </p>
        ) : null}
        {ok && completedScopes.length ? (
          <p className="mt-2 text-sm text-slate-500">
            Escopos concluídos: {completedScopes.length}
          </p>
        ) : null}
        {ok && submitResult?.proof ? (
          <div className="mt-4 space-y-3">
            <p className="text-sm font-semibold text-slate-700">Comprovante</p>
            {submitResult.proof.kind === "qr" ? (
              <div className="grid place-items-center">
                <QRCodeImage value={submitResult.proof.value} />
              </div>
            ) : (
              <code className="block break-all rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                {submitResult.proof.value}
              </code>
            )}
          </div>
        ) : null}
        <Button className="mt-6" onClick={onNewResponse}>
          Nova resposta
        </Button>
      </div>
    </section>
  );
}
