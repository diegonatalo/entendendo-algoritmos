export const CODIGOS_CAP08 = {
  calendario: `function calendarioGuloso(aulas) {
  // a aula que termina primeiro vem antes
  const ordenadas = [...aulas].sort((a, b) => a.fim - b.fim);
  const escolhidas = [];
  let ultimoFim = -Infinity;

  for (const aula of ordenadas) {
    if (aula.inicio >= ultimoFim) {   // não conflita com a última escolhida
      escolhidas.push(aula.nome);
      ultimoFim = aula.fim;
    }
  }

  return escolhidas;
}`,

  coberturaGulosa: `function coberturaGulosa(universo, conjuntos) {
  const faltam = new Set(universo);
  const escolhidos = [];

  while (faltam.size > 0) {
    // o conjunto que cobre mais itens ainda não cobertos
    let melhor = null;
    let melhorQtd = 0;
    for (const [nome, itens] of Object.entries(conjuntos)) {
      const novos = itens.filter((i) => faltam.has(i)).length;
      if (novos > melhorQtd) {
        melhor = nome;
        melhorQtd = novos;
      }
    }

    if (melhor === null) break;   // sobrou algo que nenhum conjunto cobre
    escolhidos.push(melhor);
    conjuntos[melhor].forEach((i) => faltam.delete(i));
  }

  return escolhidos;
}`,

  caixeiro: `const distancia = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

function comprimento(cidades, rota) {
  let total = 0;
  for (let i = 0; i < rota.length; i++) {
    total += distancia(cidades[rota[i]], cidades[rota[(i + 1) % rota.length]]);   // volta ao início
  }
  return total;
}

// Aproximação gulosa: sempre vai para a cidade não visitada mais próxima
function vizinhoMaisProximo(cidades) {
  const rota = [0];
  while (rota.length < cidades.length) {
    const atual = cidades[rota[rota.length - 1]];
    let proxima = -1;
    for (let i = 0; i < cidades.length; i++) {
      if (rota.includes(i)) continue;
      if (proxima === -1 || distancia(atual, cidades[i]) < distancia(atual, cidades[proxima])) {
        proxima = i;
      }
    }
    rota.push(proxima);
  }
  return rota;
}

// Força bruta: testa todas as (n - 1)! ordens possíveis
function forcaBruta(cidades) {
  let melhor = null;
  let menor = Infinity;

  function permutar(rota, restantes) {
    if (restantes.length === 0) {
      const c = comprimento(cidades, rota);
      if (c < menor) {
        menor = c;
        melhor = rota;
      }
      return;
    }
    for (let i = 0; i < restantes.length; i++) {
      permutar([...rota, restantes[i]], restantes.filter((_, j) => j !== i));
    }
  }

  permutar([0], cidades.map((_, i) => i).slice(1));
  return melhor;
}`,
} as const;
