import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { openGraphBase } from "@/lib/metadata";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";
import { THEME_KEY } from "@/lib/storage-keys";
import { themeScript } from "@/lib/theme";

// texto em Inter, títulos em Bricolage Grotesque e código/números em JetBrains Mono
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

// sem JS fica o tema escuro (classe dark no <html>); com JS, themeScript aplica a escolha salva ou o sistema

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  ...openGraphBase(SITE_NAME, SITE_DESCRIPTION, "/", "/og/inicio"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // a classe dark é ajustada pelo script abaixo antes da hidratação
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${inter.variable} ${bricolage.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script id="tema-inicial" strategy="beforeInteractive">
          {themeScript(THEME_KEY)}
        </Script>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-emerald-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-emerald-950"
        >
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
