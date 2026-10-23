export const CODIGOS_CAP05 = {
  tabelaHash: `function funcaoHash(chave, tamanho) {
  let soma = 0;
  for (let i = 0; i < chave.length; i++) {
    soma += chave.charCodeAt(i);   // soma os códigos das letras
  }
  return soma % tamanho;           // posição (balde) da chave
}

function inserir(tabela, chave, valor) {
  const balde = tabela[funcaoHash(chave, tabela.length)];
  const existente = balde.find((e) => e.chave === chave);

  if (existente) existente.valor = valor;   // chave repetida: atualiza
  else balde.push({ chave, valor });        // colisão? entra na lista do balde
}

function buscar(tabela, chave) {
  const balde = tabela[funcaoHash(chave, tabela.length)];
  return balde.find((e) => e.chave === chave)?.valor;   // só compara dentro do balde
}`,

  usosHash: `// Duplicatas: um conjunto (tabela hash) responde "já vi?" em uma consulta
function votar(jaVotaram, nome) {
  const chave = nome.trim().toLowerCase();
  if (jaVotaram.has(chave)) return false;   // já votou: barra
  jaVotaram.add(chave);
  return true;
}

// Cache: se a página já está guardada, devolve na hora
function acessar(cache, url, buscarNoServidor) {
  if (cache.has(url)) return cache.get(url);   // acerto

  const pagina = buscarNoServidor(url);        // falha: caro
  cache.set(url, pagina);                      // guarda para a próxima vez
  return pagina;
}`,
} as const;
