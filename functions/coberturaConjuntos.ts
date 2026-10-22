import {
  Conjuntos,
  PassoGuloso,
  ResultadoGuloso,
  ResultadoOtimo,
} from "@/@types/guloso";

export function coberturaGulosa(
  universo: string[],
  conjuntos: Conjuntos,
): ResultadoGuloso {
  const faltam = new Set(universo);
  const cobertos: string[] = [];
  const solucao: string[] = [];
  const passos: PassoGuloso[] = [];

  function contarNovos(): Record<string, number> {
    const candidatos: Record<string, number> = {};
    for (const [nome, itens] of Object.entries(conjuntos)) {
      candidatos[nome] = itens.filter((item) => faltam.has(item)).length;
    }
    return candidatos;
  }

  function registrar(
    tipo: PassoGuloso["tipo"],
    escolhida: string | null,
    candidatos: Record<string, number>,
    descricao: string,
  ) {
    passos.push({
      tipo,
      escolhida,
      candidatos,
      cobertos: [...cobertos],
      faltam: universo.filter((item) => faltam.has(item)),
      solucao: [...solucao],
      descricao,
    });
  }

  registrar(
    "inicio",
    null,
    contarNovos(),
    `Faltam cobrir ${universo.length} itens`,
  );

  while (faltam.size > 0) {
    const candidatos = contarNovos();

    // escolhe o conjunto que cobre mais itens ainda não cobertos
    let melhor: string | null = null;
    for (const nome of Object.keys(conjuntos)) {
      if (candidatos[nome] > 0 && (melhor === null || candidatos[nome] > candidatos[melhor])) {
        melhor = nome;
      }
    }
    if (melhor === null) break;

    const novos = conjuntos[melhor].filter((item) => faltam.has(item));
    for (const item of novos) {
      faltam.delete(item);
      cobertos.push(item);
    }
    solucao.push(melhor);

    registrar(
      "escolhe",
      melhor,
      candidatos,
      `Escolhe ${melhor}: cobre ${novos.length} ${novos.length === 1 ? "novo" : "novos"} (${novos.join(", ")})`,
    );
  }

  const completa = faltam.size === 0;
  registrar(
    "fim",
    null,
    {},
    completa
      ? `Tudo coberto com ${solucao.length} conjuntos: ${solucao.join(", ")}`
      : `Não é possível cobrir: ${[...faltam].join(", ")}`,
  );

  return { passos, solucao, completa };
}

// força bruta: testa todos os subconjuntos (O(2^n)) e fica com o menor que cobre tudo
export function coberturaOtima(
  universo: string[],
  conjuntos: Conjuntos,
): ResultadoOtimo {
  const nomes = Object.keys(conjuntos);
  const total = 2 ** nomes.length - 1;
  let melhor: string[] | null = null;

  for (let mascara = 1; mascara <= total; mascara++) {
    const escolhidos = nomes.filter((_, i) => mascara & (1 << i));
    if (melhor !== null && escolhidos.length >= melhor.length) continue;

    const cobertos = new Set(escolhidos.flatMap((nome) => conjuntos[nome]));
    if (universo.every((item) => cobertos.has(item))) {
      melhor = escolhidos;
    }
  }

  return { solucao: melhor, combinacoesTestadas: total };
}
