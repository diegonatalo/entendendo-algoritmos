import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const nav = vi.hoisted(() => ({ pathname: "/app/big-o" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));

import { LessonNav } from "./lesson-nav";

beforeEach(() => {
  nav.pathname = "/app/big-o";
});

describe("LessonNav", () => {
  it("liga a lição anterior e a seguinte", () => {
    render(<LessonNav />);
    expect(screen.getByRole("link", { name: /Busca binária/ })).toHaveAttribute("href", "/app/busca-binaria");
    expect(screen.getByRole("link", { name: /Arrays e listas encadeadas/ })).toHaveAttribute("href", "/app/arrays-listas");
  });

  it("a primeira lição só tem a seguinte", () => {
    nav.pathname = "/app/busca-binaria";
    render(<LessonNav />);
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("não aparece fora das lições", () => {
    nav.pathname = "/app";
    const { container } = render(<LessonNav />);
    expect(container).toBeEmptyDOMElement();
  });
});
