import { CPA_ENCERRADA_MESSAGE } from '../config/cpa-periodo'

export function PeriodoEncerradoPage() {
  return (
    <main className="grid flex-1 place-items-center px-4 py-10">
      <section className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white/95 p-8 text-center shadow-xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
          ✓
        </div>

        <p className="mb-3 text-sm font-semibold tracking-[0.24em] text-blue-700">
          CPA FeMASS
        </p>

        <h1 className="mb-4 text-3xl font-bold text-slate-900">
          Período de avaliação encerrado
        </h1>

        <p className="mb-4 text-lg leading-relaxed text-slate-700">
          {CPA_ENCERRADA_MESSAGE}
        </p>

        <p className="text-base leading-relaxed text-slate-600">
          Agradecemos a participação da comunidade acadêmica. As respostas
          recebidas serão analisadas pela Comissão Própria de Avaliação.
        </p>
      </section>
    </main>
  )
}