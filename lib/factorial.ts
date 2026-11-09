import { RecursionStep, Frame, FactorialResult } from "@/types/recursion";

export function factorial(n: number): FactorialResult {
  const stack: Frame[] = [];
  const steps: RecursionStep[] = [];

  function register(type: RecursionStep["type"], description: string) {
    steps.push({
      type,
      description,
      stack: stack.map((frame) => ({ ...frame })),
    });
  }

  function call(x: number): number {
    const frame: Frame = { n: x };
    stack.push(frame);

    let returnValue: number;
    if (x <= 1) {
      register("base", `fatorial(${x}) é o caso base e retorna 1`);
      returnValue = 1;
    } else {
      register("push", `fatorial(${x}) chama fatorial(${x - 1})`);
      returnValue = x * call(x - 1);
    }

    frame.returnValue = returnValue;
    register("returns", `fatorial(${x}) retorna ${returnValue}`);
    stack.pop();
    return returnValue;
  }

  const result = call(n);
  return { result, steps };
}
