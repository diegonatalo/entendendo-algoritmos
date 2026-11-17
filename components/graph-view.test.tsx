import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GraphView } from "@/components/graph-view";

const POSITIONS = { a: { x: 0, y: 0 }, b: { x: 100, y: 0 } };
const NODES = ["a", "b"].map((name) => ({
  name,
  className: "fill-zinc-800",
  textClassName: "fill-zinc-100",
}));

const renderGraph = (edges: Parameters<typeof GraphView>[0]["edges"]) =>
  render(
    <GraphView
      label="Grafo de teste"
      width={200}
      height={100}
      radius={10}
      positions={POSITIONS}
      nodes={NODES}
      edges={edges}
    />,
  );

describe("GraphView", () => {
  it("mostra os nós, os pesos e o nome acessível", () => {
    renderGraph([{ from: "a", to: "b", label: 5 }]);
    expect(screen.getByRole("img", { name: "Grafo de teste" })).toBeInTheDocument();
    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("usa a seta e a espessura do tom da aresta", () => {
    const { container } = renderGraph([{ from: "a", to: "b", tone: "path" }]);
    const line = container.querySelector("line")!;
    expect(line).toHaveAttribute("stroke-width", "3");
    expect(line.getAttribute("marker-end")).toMatch(/-path\)$/);
  });

  it("afasta arestas em sentidos opostos para não se sobreporem", () => {
    const { container } = renderGraph([
      { from: "a", to: "b" },
      { from: "b", to: "a" },
    ]);
    const [ab, ba] = container.querySelectorAll("line");
    expect(ab.getAttribute("y1")).not.toBe(ba.getAttribute("y2"));
  });
});
