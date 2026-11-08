Requer [Node.js](https://nodejs.org) 20.9 ou superior e [pnpm](https://pnpm.io).

```bash
git clone https://github.com/diegonatalo/entendendo-algoritmos.git
cd entendendo-algoritmos
pnpm install
pnpm dev        # http://localhost:3000
```

| Comando | O que faz |
|---|---|
| `pnpm dev` | Servidor de desenvolvimento com recarga automática |
| `pnpm build` | Gera o build de produção (todas as páginas saem estáticas) |
| `pnpm start` | Serve o build de produção |
| `pnpm lint` | Roda o ESLint |
| `npx tsc --noEmit` | Confere os tipos do TypeScript |

### 🔑 Variáveis de ambiente

Nenhuma é obrigatória.

| Variável | Descrição | Se não definir |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Endereço público do site, usado nos links absolutos de Open Graph, sitemap e robots. | Usa `https://entendendo-algoritmos.vercel.app` (`app/site.ts`). |

```ini
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com
```
