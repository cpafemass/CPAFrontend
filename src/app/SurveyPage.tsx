import { useCallback, useEffect, useState } from "react";
import { AppFooter } from "../components/layout/AppFooter";
import { SurveyForm } from "../components/survey/SurveyForm";
import { Button } from "../components/survey/ui/Button";
import { LoadingState } from "../components/survey/ui/LoadingState";
import { fetchCampaignPublicState } from "../services/campaign-state-api";
import { AppHeader } from "../components/layout/AppHeader";

const FALLBACK_UNAVAILABLE_MESSAGE =
  import.meta.env.VITE_CPA_CAMPAIGN_UNAVAILABLE_MESSAGE?.trim() ||
  "A pesquisa está indisponível no momento. Tente novamente mais tarde.";

export function SurveyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [unavailableMessage, setUnavailableMessage] = useState(
    FALLBACK_UNAVAILABLE_MESSAGE,
  );

  const loadCampaignState = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const campaignState = await fetchCampaignPublicState();
      setIsOpen(campaignState.isOpen);
      if (!campaignState.isOpen) {
        setUnavailableMessage(
          campaignState.unavailableMessage || FALLBACK_UNAVAILABLE_MESSAGE,
        );
      }
    } catch (stateError) {
      setIsOpen(false);
      setUnavailableMessage(FALLBACK_UNAVAILABLE_MESSAGE);
      setError(
        stateError instanceof Error
          ? stateError.message
          : "Não foi possível consultar o estado da campanha.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadCampaignState();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadCampaignState]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.12),_transparent_34rem),linear-gradient(180deg,_#f8fbff,_#eef3f8)] text-slate-900">
      <div className="flex min-h-screen flex-col">
        <AppHeader />

        {isLoading ? (
          <main className="grid flex-1 place-items-center py-6 sm:py-10">
            <div className="w-full max-w-2xl px-4 sm:px-6">
              <LoadingState message="Verificando disponibilidade da pesquisa..." />
            </div>
          </main>
        ) : isOpen ? (
          <SurveyForm />
        ) : (
          <main className="grid flex-1 place-items-center py-6 sm:py-10">
            <section className="survey-enter w-full max-w-2xl px-4 sm:px-6">
              <div
                className="space-y-4 rounded-xl border border-amber-200 bg-amber-50 p-5 text-center shadow-xl shadow-slate-900/10 sm:p-8"
                role="status"
                aria-live="polite"
              >
                <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">
                  Pesquisa indisponível
                </h1>
                <p className="text-slate-700">{unavailableMessage}</p>
                {error ? (
                  <>
                    <p className="text-sm font-semibold text-red-700">{error}</p>
                    <Button onClick={() => void loadCampaignState()}>
                      Tentar novamente
                    </Button>
                  </>
                ) : null}
              </div>
            </section>
          </main>
        )}

        <AppFooter />
      </div>
    </div>
  );
}
