import { useState, type FormEvent } from 'react'
import { Actions } from '../ui/Actions'
import { Button } from '../ui/Button'

interface EmailProps { onBack: () => void; onSubmit: (email: string) => Promise<void>; loading: boolean; error: string }
export function EmailVerificationStep({ onBack, onSubmit, loading, error }: EmailProps) {
  const [email, setEmail] = useState('')
  const submit = (e: FormEvent) => { e.preventDefault(); void onSubmit(email.trim()) }
  return <section className="survey-enter w-full max-w-xl px-4"><form className="rounded-lg border border-slate-200 bg-white p-6" onSubmit={submit}><h2 className="text-2xl font-black">Confirme seu e-mail institucional</h2><p className="mt-2 text-slate-600">Enviaremos um código para confirmar o acesso. Não informaremos se o endereço existe.</p><label className="mt-5 grid gap-2 font-bold">E-mail institucional<input className="h-12 rounded-lg border border-slate-300 px-4 font-normal" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>{error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}<Actions><Button variant="secondary" type="button" onClick={onBack}>Voltar</Button><Button disabled={loading} type="submit">{loading ? 'Enviando...' : 'Enviar código'}</Button></Actions></form></section>
}

interface PinProps { onBack: () => void; onConfirm: (pin: string) => Promise<void>; onResend: () => Promise<void>; loading: boolean; error: string }
export function PinVerificationStep({ onBack, onConfirm, onResend, loading, error }: PinProps) {
  const [pin, setPin] = useState('')
  return <section className="survey-enter w-full max-w-xl px-4"><form className="rounded-lg border border-slate-200 bg-white p-6" onSubmit={(e) => { e.preventDefault(); void onConfirm(pin.trim()) }}><h2 className="text-2xl font-black">Informe o código recebido</h2><p className="mt-2 text-slate-600">O código expira e tem número limitado de tentativas.</p><label className="mt-5 grid gap-2 font-bold">Código<input className="h-12 rounded-lg border border-slate-300 px-4 font-normal tracking-widest" autoComplete="one-time-code" required value={pin} onChange={(e) => setPin(e.target.value)} /></label>{error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}<Actions><Button variant="secondary" type="button" onClick={onBack}>Alterar e-mail</Button><Button disabled={loading} type="submit">{loading ? 'Confirmando...' : 'Confirmar código'}</Button></Actions><button className="mt-5 text-sm font-bold text-blue-700" disabled={loading} type="button" onClick={() => void onResend()}>Reenviar código</button></form></section>
}
