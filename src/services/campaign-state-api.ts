import { buildApiEndpoint } from "../config/api";
import { fetchWithRetry } from "../utils/fetch-with-retry";

const CAMPAIGN_PUBLIC_STATE_ENDPOINT = buildApiEndpoint(
  import.meta.env.VITE_CPA_CAMPAIGN_STATE_ENDPOINT?.trim() ||
    "/campanha/estado-publico",
);
const DEFAULT_OPEN_STATES = "aberta,aberto,open,opened";
const OPEN_STATES = new Set(
  (import.meta.env.VITE_CPA_CAMPAIGN_OPEN_STATES ?? DEFAULT_OPEN_STATES)
    .split(",")
    .map((value: string) => value.trim().toLowerCase())
    .filter(Boolean),
);

interface CampaignStateApiResponse {
  aberta?: boolean;
  open?: boolean;
  isOpen?: boolean;
  estado?: string;
  status?: string;
  state?: string;
  mensagem?: string;
  message?: string;
  unavailableMessage?: string;
  mensagemIndisponibilidade?: string;
}

export interface CampaignPublicState {
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

function resolveOpenState(body: CampaignStateApiResponse) {
  const booleanState = body.aberta ?? body.open ?? body.isOpen;
  if (typeof booleanState === "boolean") return booleanState;
  const textualState = body.estado ?? body.status ?? body.state;
  if (!textualState) {
    throw new Error("A resposta de estado da campanha é inválida.");
  }
  return OPEN_STATES.has(textualState.trim().toLowerCase());
}

function resolveUnavailableMessage(body: CampaignStateApiResponse) {
  const message =
    body.mensagemIndisponibilidade ??
    body.unavailableMessage ??
    body.mensagem ??
    body.message;
  return message?.trim() || undefined;
}

export async function fetchCampaignPublicState(): Promise<CampaignPublicState> {
  const response = await fetchWithRetry(CAMPAIGN_PUBLIC_STATE_ENDPOINT, {
    retries: 1,
  });
  if (!response.ok) {
    throw new Error(
      (await responseMessage(response)) ||
        "Não foi possível consultar o estado da campanha.",
    );
  }
  const body = (await response.json()) as CampaignStateApiResponse;
  return {
    isOpen: resolveOpenState(body),
    unavailableMessage: resolveUnavailableMessage(body),
  };
}
