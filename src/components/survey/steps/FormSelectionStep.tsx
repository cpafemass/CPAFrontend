import type { CatalogForm } from '../../../lib/survey-types'
import { Actions } from '../ui/Actions'
import { Button } from '../ui/Button'
import { LoadingState } from '../ui/LoadingState'

interface Props { forms: CatalogForm[]; selected: CatalogForm | null; loading: boolean; error: string; onSelect: (form: CatalogForm) => void; onRetry: () => void; onBack: () => void; onNext: () => void }
export function FormSelectionStep({ forms, selected, loading, error, onSelect, onRetry, onBack, onNext }: Props) {
  return <section className="survey-enter w-full max-w-2xl px-4"><h2 className="mb-3 text-center text-3xl font-black text-slate-950">Selecione a avaliação</h2><p className="mb-6 text-center text-slate-600">Escolha o formulário disponível para o seu público.</p>{loading ? <LoadingState message="Carregando formulários..." /> : null}{error ? <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}<Button className="mt-3" onClick={onRetry}>Tentar novamente</Button></div> : null}<div className="grid gap-3">{forms.map((form) => <button className={`rounded-lg border p-4 text-left ${selected?.code === form.code ? 'border-blue-700 bg-blue-50' : 'border-slate-200 bg-white'}`} key={`${form.code}-${form.version}`} onClick={() => onSelect(form)}><strong className="block text-slate-950">{form.name}</strong><small className="mt-1 block text-slate-500">{form.scope === 'DISCIPLINA' ? 'Avaliação por disciplina' : 'Avaliação geral'}</small></button>)}</div><Actions><Button variant="secondary" onClick={onBack}>Voltar</Button><Button disabled={!selected || loading || Boolean(error)} onClick={onNext}>Continuar</Button></Actions></section>
}
