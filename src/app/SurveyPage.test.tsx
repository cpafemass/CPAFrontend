import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SurveyPage } from "./SurveyPage";
import { fetchCampaignPublicState } from "../services/campaign-state-api";

vi.mock("../services/campaign-state-api", () => ({
  fetchCampaignPublicState: vi.fn(),
}));

vi.mock("../components/survey/SurveyForm", () => ({
  SurveyForm: () => <div data-testid="survey-form">survey-form</div>,
}));

describe("SurveyPage", () => {
  beforeEach(() => {
    vi.mocked(fetchCampaignPublicState).mockResolvedValue({
      state: "ABERTA",
      isOpen: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders the survey when the campaign is open", async () => {
    render(<SurveyPage />);

    expect(
      await screen.findByTestId("survey-form"),
    ).not.toBeNull();
  });

  it("shows an unavailable message when the campaign is closed", async () => {
    vi.mocked(fetchCampaignPublicState).mockResolvedValueOnce({
      state: "ENCERRADA",
      isOpen: false,
      unavailableMessage: "A campanha está encerrada para respostas.",
    });

    render(<SurveyPage />);

    expect(
      await screen.findByRole("heading", { name: "Pesquisa indisponível" }),
    ).not.toBeNull();
    expect(
      screen.getByText("A campanha está encerrada para respostas."),
    ).not.toBeNull();
    expect(screen.queryByTestId("survey-form")).toBeNull();
  });

  it("keeps the survey hidden when campaign state lookup fails", async () => {
    vi.mocked(fetchCampaignPublicState).mockRejectedValueOnce(
      new Error("Serviço temporariamente indisponível"),
    );

    render(<SurveyPage />);

    expect(
      await screen.findByText("Serviço temporariamente indisponível"),
    ).not.toBeNull();
    expect(screen.getByRole("button", { name: "Tentar novamente" })).not.toBeNull();
    expect(screen.queryByTestId("survey-form")).toBeNull();

    await waitFor(() => expect(fetchCampaignPublicState).toHaveBeenCalledTimes(1));
  });
});
