import { p, titulo, lista, type Explicacao } from "./blocos";

export const EXPLICACOES_CAP11 = {
  proximosPassos: {
    simples: [
      p("Este capítulo do livro aponta para onde seguir depois do básico. Cada tema abaixo é um assunto à parte, e você não precisa estudar todos: escolha o que combina com o que quer construir."),
      lista(
        "Buscas rápidas em dados que mudam: árvores.",
        "Fazer um buscador: índices invertidos.",
        "Trabalhar com som ou sinais: transformada de Fourier.",
        "Ganhar velocidade: algoritmos paralelos e MapReduce.",
        "Dados enormes e pouca memória: filtros de Bloom e HyperLogLog.",
        "Segurança: funções SHA e Diffie-Hellman.",
        "Otimizar com restrições: programação linear.",
      ),
      p("Os cartões abaixo resumem cada tema e indicam qual página do app tem a base necessária."),
    ],
    tecnica: [
      titulo("Um nível a mais, tema por tema"),
      lista(
        "Árvores: uma árvore de busca binária faz busca, inserção e remoção em O(h), com h a altura; balanceada (AVL, rubro-negra), h = O(log n). Bancos de dados costumam usar árvores B.",
        "Índices invertidos: mapeiam termo → lista de documentos. Uma consulta com várias palavras intersecciona essas listas.",
        "Transformada de Fourier: decompõe um sinal em frequências. A versão rápida (FFT) custa O(n log n), contra O(n²) do cálculo direto.",
        "Algoritmos paralelos: o ganho é limitado pela parte que não dá para paralelizar (lei de Amdahl) e pelo custo de coordenar o trabalho.",
        "MapReduce: o map transforma cada item de forma independente e o reduce agrega os resultados com a mesma chave. A independência é o que permite distribuir.",
        "Filtro de Bloom: tabela de bits e k funções hash; pode dar falso positivo, mas nunca falso negativo. O HyperLogLog estima quantos itens distintos existem com pouquíssima memória, com erro relativo em torno de 1,04/√m para m registradores.",
        "SHA: funções hash criptográficas (por exemplo, SHA-256, com saída de 256 bits), determinísticas e difíceis de inverter. O hash sensível à localidade faz o oposto: entradas parecidas geram hashes parecidos.",
        "Diffie-Hellman: dois lados chegam a um segredo comum trocando valores públicos; a segurança se apoia na dificuldade do logaritmo discreto.",
        "Programação linear: maximiza ou minimiza uma função linear sujeita a restrições lineares. O Simplex é eficiente na prática, e existem algoritmos de tempo polinomial (pontos interiores).",
      ),
      p("Esta página é um resumo: nenhum desses temas tem demonstração interativa aqui."),
    ],
  },
} satisfies Record<string, Explicacao>;
