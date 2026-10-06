import { useState, type FormEvent } from "react";
import { Actions } from "../ui/Actions";
import { Button } from "../ui/Button";

interface EmailProps {
  onBack: () => void;
  onSubmit: (email: string) => Promise<void>;
  loading: boolean;
  error: string;
}
export function EmailVerificationStep({
  onBack,
  onSubmit,
  loading,
  error,
}: EmailProps) {
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim();
    if (!/^[A-Za-z._%+-]+@femass\.edu\.br$/i.test(normalizedEmail)) {
      setValidationError(
        "Informe seu e-mail institucional sem matrícula antes do @.",
      );
      return;
    }
    setValidationError("");
    void onSubmit(normalizedEmail);
  };
  return (
    <section className="survey-enter w-full max-w-xl px-4 sm:px-6">
      <form
        className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/10 sm:p-8"
        onSubmit={submit}
      >
        <div className="space-y-3">
          <h2 className="text-2xl font-black sm:text-3xl">
            Confirme seu e-mail institucional
          </h2>
          <p className="leading-relaxed text-slate-600">
            Enviaremos um código para confirmar o acesso. Não informaremos se o
            endereço existe.
          </p>
        </div>
        <label className="grid gap-2 font-bold">
          E-mail institucional
          <input
            className="h-12 rounded-lg border border-slate-300 px-4 text-base font-normal"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (validationError) setValidationError("");
            }}
            aria-invalid={validationError ? "true" : undefined}
            aria-describedby={validationError ? "institutional-email-error" : undefined}
          />
        </label>
        {validationError ? (
          <p
            id="institutional-email-error"
            role="alert"
            className="text-sm font-semibold text-red-600"
          >
            {validationError}
          </p>
        ) : error ? (
          <p role="alert" className="text-sm font-semibold text-red-600">{error}</p>
        ) : null}
        <Actions>
          <Button variant="secondary" type="button" onClick={onBack}>
            Voltar
          </Button>
          <Button disabled={loading} type="submit">
            {loading ? "Enviando..." : "Enviar código"}
          </Button>
        </Actions>
      </form>
    </section>
  );
}

interface PinProps {
  onBack: () => void;
  onConfirm: (pin: string) => Promise<void>;
  onResend: () => Promise<void>;
  loading: boolean;
  error: string;
}
export function PinVerificationStep({
  onBack,
  onConfirm,
  onResend,
  loading,
  error,
}: PinProps) {
  const [pin, setPin] = useState("");
  return (
    <section className="survey-enter w-full max-w-xl px-4 sm:px-6">
      <form
        className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/10 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          void onConfirm(pin.trim());
        }}
      >
        <div className="space-y-3">
          <h2 className="text-2xl font-black sm:text-3xl">
            Informe o código recebido
          </h2>
          <p className="leading-relaxed text-slate-600">
            O código expira e tem número limitado de tentativas.
          </p>
        </div>
        <label className="grid gap-2 font-bold">
          Código
          <input
            className="h-12 rounded-lg border border-slate-300 px-4 text-base font-normal tracking-widest"
            autoComplete="one-time-code"
            required
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
        </label>
        {error ? (
          <p className="text-sm font-semibold text-red-600">{error}</p>
        ) : null}
        <Actions>
          <Button variant="secondary" type="button" onClick={onBack}>
            Alterar e-mail
          </Button>
          <Button disabled={loading} type="submit">
            {loading ? "Confirmando..." : "Confirmar código"}
          </Button>
        </Actions>
        <button
          className="text-sm font-bold text-blue-700"
          disabled={loading}
          type="button"
          onClick={() => void onResend()}
        >
          Reenviar código
        </button>
      </form>
    </section>
  );
}
