import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const nav = vi.hoisted(() => ({ pathname: "/app/busca-binaria" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));

import { Sidebar } from "./sidebar";

beforeEach(() => {
  nav.pathname = "/app/busca-binaria";
  Element.prototype.scrollIntoView = vi.fn();
  document.body.style.overflow = "";
});

const openDrawer = () => userEvent.click(screen.getByRole("button", { name: "Abrir menu de capítulos" }));
const drawer = () => screen.getByRole("dialog", { name: "Menu de capítulos" });
const fixed = () => screen.getAllByRole("navigation", { name: "Capítulos" })[0];
const chapterButton = (n: number) => within(fixed()).getByRole("button", { name: new RegExp(`^Capítulo ${n}:`) });

describe("Sidebar: capítulos", () => {
  it("o capítulo da página atual fica aberto e a página marcada", () => {
    render(<Sidebar />);
    const chapter1 = chapterButton(1);
    expect(chapter1).toHaveAttribute("aria-expanded", "true");
    expect(within(fixed()).getByRole("link", { name: /Busca binária/ })).toHaveAttribute("aria-current", "page");
  });

  it("os outros capítulos abrem e fecham ao clicar", async () => {
    render(<Sidebar />);
    const chapter2 = chapterButton(2);
    expect(chapter2).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(chapter2);
    expect(chapter2).toHaveAttribute("aria-expanded", "true");
    expect(within(fixed()).getByRole("link", { name: /Ordenação por seleção/ })).toBeInTheDocument();
    await userEvent.click(chapter2);
    expect(chapter2).toHaveAttribute("aria-expanded", "false");
  });
});

describe("Sidebar: gaveta do celular", () => {
  it("abre com o foco no botão de fechar e trava a rolagem da página", async () => {
    render(<Sidebar />);
    await openDrawer();
    expect(drawer()).toHaveAttribute("aria-modal", "true");
    expect(within(drawer()).getByRole("button", { name: "Fechar menu" })).toHaveFocus();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("Esc fecha, devolve o foco e libera a rolagem", async () => {
    render(<Sidebar />);
    await openDrawer();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("button", { name: "Abrir menu de capítulos" })).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  });

  it("o Tab fica preso dentro da gaveta", async () => {
    render(<Sidebar />);
    await openDrawer();
    const close = within(drawer()).getByRole("button", { name: "Fechar menu" });
    await userEvent.tab({ shift: true });
    await userEvent.tab({ shift: true });
    // voltando do primeiro item, o foco vai para o último item da gaveta
    expect(drawer()).toContainElement(document.activeElement as HTMLElement);
    expect(document.activeElement).not.toBe(close);
  });

  it("navegar para outra página fecha a gaveta", async () => {
    const { rerender } = render(<Sidebar />);
    await openDrawer();
    nav.pathname = "/app/big-o";
    rerender(<Sidebar />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
