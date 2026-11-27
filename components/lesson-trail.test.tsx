import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const nav = vi.hoisted(() => ({ pathname: "/app/quicksort" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));

import { LessonTrail } from "./lesson-trail";

beforeEach(() => {
  nav.pathname = "/app/quicksort";
});

describe("LessonTrail", () => {
  it("mostra o capítulo e o código da lição", () => {
    render(<LessonTrail />);
    const trail = screen.getByRole("navigation", { name: "Você está em" });
    expect(trail).toHaveTextContent("04 · Dividir para conquistar");
    expect(screen.getByText("4.2")).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Capítulos" })).toHaveAttribute("href", "/app");
  });

  it("não aparece fora das lições", () => {
    nav.pathname = "/app";
    const { container } = render(<LessonTrail />);
    expect(container).toBeEmptyDOMElement();
  });
});
