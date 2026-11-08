### 🌐 Deploy

O app é publicado na Vercel, em <https://entendendo-algoritmos.vercel.app>. Como é um projeto
Next.js sem backend, não precisa de `vercel.json`: todas as páginas saem estáticas no build.

> [!NOTE]
> Ao mudar de domínio, defina `NEXT_PUBLIC_SITE_URL` antes do build. Sem isso, os cartões de
> compartilhamento, o sitemap e o `robots.txt` continuam apontando para o endereço antigo.

<br />
