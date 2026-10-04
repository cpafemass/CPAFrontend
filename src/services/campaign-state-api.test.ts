import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchCampaignPublicState } from "./campaign-state-api";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchCampaignPublicState", () => {
  it("uses backend availability as the source of truth", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            campanha: "cpa-2026",
            estado: "ABERTA",
            disponivelParaResposta: true,
            mensagem: "Campanha disponível para respostas.",
          }),
          { status: 200 },
        ),
      ),
    );

    await expect(fetchCampaignPublicState()).resolves.toEqual({
      isOpen: true,
      unavailableMessage: "Campanha disponível para respostas.",
    });
  });

  it("maps unavailable message from the backend", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            campanha: "cpa-2026",
            estado: "ENCERRADA",
            disponivelParaResposta: false,
            mensagem: "A campanha está encerrada para respostas no momento.",
          }),
          { status: 200 },
        ),
      ),
    );

    await expect(fetchCampaignPublicState()).resolves.toEqual({
      isOpen: false,
      unavailableMessage:
        "A campanha está encerrada para respostas no momento.",
    });
  });

  it("rejects responses without backend availability", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            campanha: "cpa-2026",
            estado: "ABERTA",
          }),
          { status: 200 },
        ),
      ),
    );

    await expect(fetchCampaignPublicState()).rejects.toThrow(
      "A resposta de disponibilidade da campanha é inválida.",
    );
  });

  it("surfaces backend failure messages", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Falha ao consultar estado" }), {
          status: 503,
        }),
      ),
    );

    await expect(fetchCampaignPublicState()).rejects.toThrow(
      "Falha ao consultar estado",
    );
  });
});
