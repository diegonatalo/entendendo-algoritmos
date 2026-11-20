import { describe, expect, it } from "vitest";
import { chapters } from "@/lib/chapters";
import { MOVED_PAGES } from "@/lib/redirects";

describe("MOVED_PAGES", () => {
  it("redireciona cada capítulo registrado", () => {
    expect([...MOVED_PAGES].sort()).toEqual(chapters.map((c) => c.href.replace(/^\/app\//, "")).sort());
  });
});
