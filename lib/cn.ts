type ClassValue = string | false | null | undefined;

/** Junta classes, ignorando as condicionais que deram falso. */
export const cn = (...classes: ClassValue[]): string => classes.filter(Boolean).join(" ");
