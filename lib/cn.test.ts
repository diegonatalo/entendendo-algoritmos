import { describe, expect, it } from "vitest";
import { cn } from "@/lib/cn";

describe("cn", () => {
  it("junta as classes com espaço", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("ignora falso, nulo, indefinido e texto vazio", () => {
    const active = false;
    expect(cn("a", active && "b", null, undefined, "", "c")).toBe("a c");
  });
});
