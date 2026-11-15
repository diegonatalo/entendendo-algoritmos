import { describe, expect, it, vi } from "vitest";
import { randomList, reversedList, sortedList } from "@/lib/generators";
import { randomNumbers, readNumbers } from "@/lib/input";

describe("geradores de listas", () => {
  it("a lista aleatória tem o tamanho pedido e repete com a mesma semente", () => {
    const a = randomList(20);
    expect(a).toHaveLength(20);
    expect(randomList(20)).toEqual(a);
    expect(randomList(20, 7)).not.toEqual(a);
    for (const n of a) {
      expect(Number.isInteger(n)).toBe(true);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(200);
    }
  });

  it("ordenada vai de 1 a n e invertida de n a 1", () => {
    expect(sortedList(4)).toEqual([1, 2, 3, 4]);
    expect(reversedList(4)).toEqual([4, 3, 2, 1]);
    expect(sortedList(0)).toEqual([]);
  });
});

describe("readNumbers", () => {
  it("aceita vírgula, ponto e vírgula e espaços como separadores", () => {
    expect(readNumbers("3, 5; 8 2")).toEqual([3, 5, 8, 2]);
    expect(readNumbers("  1,,2  ")).toEqual([1, 2]);
    expect(readNumbers("")).toEqual([]);
  });

  it("texto que não é número vira NaN para a página validar", () => {
    expect(readNumbers("1, a")).toEqual([1, NaN]);
  });
});

describe("randomNumbers", () => {
  it("gera a quantidade pedida de números de 1 a 99, separados por vírgula", () => {
    const random = vi.spyOn(Math, "random");
    random.mockReturnValueOnce(0).mockReturnValueOnce(0.999).mockReturnValueOnce(0.5);
    expect(randomNumbers(3)).toBe("1, 99, 50");
    random.mockRestore();
    expect(readNumbers(randomNumbers(10))).toHaveLength(10);
  });
});
