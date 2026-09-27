import { escalaAvaliacao } from "../../../lib/survey-data";
import { cx } from "../../../utils/classnames";

interface RatingScaleProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

export function RatingScale({ value, onChange, label }: RatingScaleProps) {
  return (
    <div className="grid gap-3">
      <p className="font-bold text-slate-800">{label}</p>
      <div className="grid grid-cols-5 gap-2">
        {escalaAvaliacao.map(({ valor, rotulo }) => (
          <button
            className={cx(
              "min-h-14 rounded-lg border-2 px-2 py-2 text-sm font-black transition hover:-translate-y-0.5 hover:border-blue-400 sm:text-base",
              value === valor
                ? "border-blue-700 bg-blue-700 text-white shadow-md shadow-blue-900/20"
                : "border-transparent bg-slate-100 text-slate-500",
            )}
            key={valor}
            onClick={() => onChange(valor)}
            aria-label={`${valor} - ${rotulo}`}
            type="button"
          >
            {valor}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs font-medium text-slate-500">
        <span>Discordo totalmente</span>
        <span>Concordo totalmente</span>
      </div>
    </div>
  );
}
