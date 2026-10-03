import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchCampaignPublicState } from "./campaign-state-api";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchCampaignPublicState", () => {
  it("returns open campaign state from boolean response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ aberta: true }), { status: 200 }),
      ),
    );

    await expect(fetchCampaignPublicState()).resolves.toEqual({ isOpen: true });
  });

  it("maps textual state and unavailable message from backend", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            estado: "ENCERRADA",
            mensagemIndisponibilidade:
              "A campanha está encerrada para respostas no momento.",
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
