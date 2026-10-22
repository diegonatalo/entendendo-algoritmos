import { PassoRecursao, Quadro, ResultadoFatorial } from "@/@types/recursao";

export function fatorial(n: number): ResultadoFatorial {
  const pilha: Quadro[] = [];
  const passos: PassoRecursao[] = [];

  function registrar(tipo: PassoRecursao["tipo"], descricao: string) {
    passos.push({
      tipo,
      descricao,
      pilha: pilha.map((quadro) => ({ ...quadro })),
    });
  }

  function chamar(x: number): number {
    const quadro: Quadro = { n: x };
    pilha.push(quadro);

    let retorno: number;
    if (x <= 1) {
      registrar("base", `fatorial(${x}) é o caso base e retorna 1`);
      retorno = 1;
    } else {
      registrar("empilha", `fatorial(${x}) chama fatorial(${x - 1})`);
      retorno = x * chamar(x - 1);
    }

    quadro.retorno = retorno;
    registrar("retorna", `fatorial(${x}) retorna ${retorno}`);
    pilha.pop();
    return retorno;
  }

  const resultado = chamar(n);
  return { resultado, passos };
}
