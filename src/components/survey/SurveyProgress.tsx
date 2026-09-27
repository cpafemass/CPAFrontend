import { cx } from "../../utils/classnames";
import { stepLabels } from "./survey-steps";

interface SurveyProgressProps {
  currentStep: number;
}

export function SurveyProgress({ currentStep }: SurveyProgressProps) {
  const progress = (currentStep / stepLabels.length) * 100;

  return (
    <section className="mx-auto w-full max-w-xl px-5 pb-5">
      <div className="mb-2 flex items-center justify-between text-sm font-bold">
        <span className="text-slate-500">
          Etapa {currentStep} de {stepLabels.length}
        </span>
        <span className="text-blue-700">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-blue-700 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {stepLabels.map((label, index) => {
          const active = index + 1 <= currentStep;

          return (
            <div
              className={cx(
                "grid justify-items-center gap-1 text-center text-[11px] font-bold",
                active ? "text-blue-700" : "text-slate-400",
              )}
              key={label}
            >
              <span
                className={cx(
                  "h-3 w-3 rounded-full border-2 transition-colors",
                  active
                    ? "border-blue-700 bg-blue-700"
                    : "border-slate-300 bg-white",
                )}
              />
              <span className="hidden sm:block">{label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
