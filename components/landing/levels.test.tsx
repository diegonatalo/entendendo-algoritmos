import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LEVEL_EXAMPLE } from "@/lib/landing";
import { Levels } from "./levels";

describe("Levels", () => {
  it("começa pela explicação simples", () => {
    render(<Levels />);
    expect(screen.getByRole("button", { name: "Simples" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(LEVEL_EXAMPLE.simple.lead)).toBeInTheDocument();
  });

  it("troca de nível ao clicar", async () => {
    render(<Levels />);
    await userEvent.click(screen.getByRole("button", { name: "Técnica" }));
    expect(screen.getByText(LEVEL_EXAMPLE.technique.lead)).toBeInTheDocument();
    expect(screen.queryByText(LEVEL_EXAMPLE.simple.lead)).toBeNull();

    await userEvent.click(screen.getByRole("button", { name: "Código" }));
    expect(screen.getByRole("button", { name: "Código" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/function buscaBinaria/)).toBeInTheDocument();
  });
});
