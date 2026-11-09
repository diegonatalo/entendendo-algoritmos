### 🧩 Adicionando um algoritmo novo

1. **Função:** crie `lib/meu-algoritmo.ts`, uma função pura que devolve o resultado e uma lista de passos, e os tipos em `types/meu-algoritmo.ts`.
2. **Página:** crie `app/meu-algoritmo/page.tsx` (use uma página parecida como modelo) para desenhar os passos.
3. **Registro:** acrescente a página em `lib/chapters.ts` com número do capítulo, título, rota e descrição. Menu, home, sitemap e imagem de compartilhamento saem dessa lista.
4. **Título da aba:** crie `app/meu-algoritmo/layout.tsx` copiando o de uma página existente (ele lê o título de `chapters.ts`).
5. **Conteúdo:** acrescente os textos Simples e Técnico em `lib/explanations/chNN.ts` e o trecho de código em `lib/codes/chNN.ts` (do capítulo da página), e use o componente `Explicacao` na página.
6. **Confira:** rode `pnpm lint`, `npx tsc --noEmit` e `pnpm build`.
