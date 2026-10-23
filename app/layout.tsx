import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Sidebar } from "./components/sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// escolha salva ou, na falta dela, a preferência do sistema; sem JS fica o tema escuro
const TEMA_INICIAL = `try{var t=localStorage.getItem("tema");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.dataset.theme=t}catch(e){}`;

export const metadata: Metadata = {
  title: {
    default: "Entendendo Algoritmos",
    template: "%s · Entendendo Algoritmos",
  },
  description: "Visualize passo a passo como os algoritmos funcionam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // data-theme é definido pelo script abaixo antes da hidratação
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script id="tema-inicial" strategy="beforeInteractive">
          {TEMA_INICIAL}
        </Script>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-emerald-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-emerald-950"
        >
          Pular para o conteúdo
        </a>
        <Sidebar />
        <div className="flex flex-1 flex-col lg:pl-64">{children}</div>
      </body>
    </html>
  );
}
