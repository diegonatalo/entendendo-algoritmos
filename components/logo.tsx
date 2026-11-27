import Link from "next/link";
import { cn } from "@/lib/cn";

/** A marca: três posições de uma busca binária, com a do meio acesa. */
export const LogoMark = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 30 30" aria-hidden className="shrink-0">
    <rect x="1.5" y="9" width="7" height="12" rx="2.5" className="fill-none stroke-zinc-500" strokeWidth="1.6" />
    <rect x="11.5" y="3" width="7" height="24" rx="2.5" className="fill-emerald-400" />
    <rect x="21.5" y="9" width="7" height="12" rx="2.5" className="fill-none stroke-zinc-500" strokeWidth="1.6" />
  </svg>
);

type LogoProps = {
  href?: string;
  size?: number;
  onClick?: () => void;
  className?: string;
};

/** Marca com o nome, como link para a landing. */
export const Logo = ({ href = "/", size = 28, onClick, className }: LogoProps) => (
  <Link
    href={href}
    onClick={onClick}
    className={cn(
      "flex shrink-0 items-center gap-3 whitespace-nowrap rounded-lg font-display text-lg font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-400",
      className,
    )}
  >
    <LogoMark size={size} />
    Entendendo Algoritmos
  </Link>
);
