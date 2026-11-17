import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { KnnControls, KnnPlot, plotX, plotY } from "@/components/knn-plot";

describe("KnnControls", () => {
  it("muda o k, sorteia e limpa", async () => {
    const user = userEvent.setup();
    const onKChange = vi.fn();
    const onRandom = vi.fn();
    const onClear = vi.fn();
    render(
      <KnnControls
        k={3}
        onKChange={onKChange}
        randomLabel="Sortear ponto"
        onRandom={onRandom}
        onClear={onClear}
      />,
    );
    fireEvent.change(screen.getByLabelText("Número de vizinhos (k)"), {
      target: { value: "5" },
    });
    expect(onKChange).toHaveBeenCalledWith(5);
    await user.click(screen.getByRole("button", { name: "Sortear ponto" }));
    expect(onRandom).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Limpar" }));
    expect(onClear).toHaveBeenCalled();
  });

  it("desativa Limpar sem ponto novo", () => {
    render(
      <KnnControls k={1} onKChange={() => {}} randomLabel="Sortear" onRandom={() => {}} />,
    );
    expect(screen.getByRole("button", { name: "Limpar" })).toBeDisabled();
  });
});

describe("KnnPlot", () => {
  it("liga o ponto novo a cada vizinho e alcança o mais distante", () => {
    const { container } = render(
      <KnnPlot
        label="Gráfico"
        minWidth={300}
        xLabel="x"
        yLabel="y"
        created={{ x: 0, y: 0 }}
        neighbors={[
          { x: 3, y: 4 },
          { x: 6, y: 8 },
        ]}
        onPick={() => {}}
      >
        <circle data-testid="ponto" />
      </KnnPlot>,
    );
    const links = [...container.querySelectorAll("line")].filter(
      (l) => l.getAttribute("x1") === String(plotX(0)) && l.getAttribute("y1") === String(plotY(0)),
    );
    expect(links).toHaveLength(2);
    expect(container.querySelector("circle[stroke-dasharray]")).toHaveAttribute("r", "10");
    expect(screen.getByTestId("ponto")).toBeInTheDocument();
  });
});
