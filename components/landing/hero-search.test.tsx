import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HeroSearch } from "./hero-search";

const reduceMotion = (reduce: boolean) =>
  vi.stubGlobal("matchMedia", () => ({ matches: reduce, addEventListener: () => {}, removeEventListener: () => {} }));

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("HeroSearch", () => {
  it("avança sozinha um passo por vez", () => {
    reduceMotion(false);
    render(<HeroSearch />);
    expect(screen.getByText("passo 1 de 4")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1600));
    expect(screen.getByText("passo 2 de 4")).toBeInTheDocument();
  });

  it("para no botão de pausar e volta no de continuar", async () => {
    reduceMotion(false);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<HeroSearch />);
    await user.click(screen.getByRole("button", { name: "Pausar a animação" }));
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByText("passo 1 de 4")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Continuar a animação" }));
    act(() => vi.advanceTimersByTime(1600));
    expect(screen.getByText("passo 2 de 4")).toBeInTheDocument();
  });

  it("com movimento reduzido começa parada", () => {
    reduceMotion(true);
    render(<HeroSearch />);
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByText("passo 1 de 4")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continuar a animação" })).toBeInTheDocument();
  });
});
