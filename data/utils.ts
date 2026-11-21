// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  READING_STATUS,
  type ApiBook,
  type Book,
  type Genre,
  type ReadingStatus,
} from "@/data/types";

export function normalizeBook(api: ApiBook): Book {
  return {
    ...api,
    id: String(api.id),
    genres: api.genres?.map((genre) => genre.name) ?? [],
    cover: api.cover || "/placeholder.svg",
    rating: typeof api.rating === "number" ? api.rating : 0,
    status: api.status ?? undefined,
    year: typeof api.year === "number" ? api.year : undefined,
  };
}

/**
 * Junta classes do Tailwind de forma inteligente,
 * evitando duplicação ou conflitos.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata datas para exibição legível em português.
 */
export function formatDate(date: string | Date, withTime = false): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    ...(withTime && { hour: "2-digit", minute: "2-digit" }),
  });
}

/**
 * Abrevia textos longos com reticências.
 */
export function truncate(text: string, maxLength = 100): string {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
}

/**
 * Capitaliza a primeira letra de uma string.
 */
export function capitalize(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Converte string genérica em Genre válido, ou undefined se inválido.
 */

/**
 * Converte string genérica em ReadingStatus válido, ou undefined se inválido.
 */
export function parseReadingStatus(
  value: string | undefined
): ReadingStatus | undefined {
  if (!value) return undefined;
  const allowed = READING_STATUS.map((s) => s.value);
  return allowed.includes(value as ReadingStatus)
    ? (value as ReadingStatus)
    : undefined;
}