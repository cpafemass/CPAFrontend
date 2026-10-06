import { buildApiEndpoint } from "../config/api";
import { fetchWithRetry } from "../utils/fetch-with-retry";

const CAMPAIGN_CODE = import.meta.env.VITE_CPA_CAMPAIGN?.trim() || "cpa-2026";
const CAMPAIGN_AVAILABILITY_ENDPOINT = buildApiEndpoint(
  `/campanhas/${encodeURIComponent(CAMPAIGN_CODE)}/disponibilidade`,
);

interface CampaignStateApiResponse {
  campanha: string;
  estado: "RASCUNHO" | "APROVADA" | "ABERTA" | "ENCERRADA";
  disponivelParaResposta: boolean;
  mensagem?: string | null;
}

export type CampaignState = "RASCUNHO" | "APROVADA" | "ABERTA" | "ENCERRADA";

export interface CampaignPublicState {
  state: CampaignState;
  isOpen: boolean;
  unavailableMessage?: string;
}

async function responseMessage(response: Response) {
  const text = await response.text();
  try {
    const body = JSON.parse(text) as { error?: string; message?: string };
    return body.error ?? body.message ?? text;
  } catch {
    return text;
  }
}

export async function fetchCampaignPublicState(): Promise<CampaignPublicState> {
  const response = await fetchWithRetry(CAMPAIGN_AVAILABILITY_ENDPOINT, {
    retries: 1,
  });
  if (!response.ok) {
    throw new Error(
      (await responseMessage(response)) ||
        "Não foi possível consultar o estado da campanha.",
    );
  }

  const body = (await response.json()) as CampaignStateApiResponse;
  if (typeof body.disponivelParaResposta !== "boolean") {
    throw new Error("A resposta de disponibilidade da campanha é inválida.");
  }

  return {
    state: body.estado,
    isOpen: body.disponivelParaResposta,
    unavailableMessage: body.mensagem?.trim() || undefined,
  };
}
