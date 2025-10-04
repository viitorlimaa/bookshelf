// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { GENRES, READING_STATUS, type Genre, type ReadingStatus } from "@/types"

/**
 * Junta classes do Tailwind de forma inteligente,
 * evitando duplicação ou conflitos.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata datas para exibição legível em português.
 */
export function formatDate(date: string | Date, withTime = false): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    ...(withTime && { hour: "2-digit", minute: "2-digit" }),
  })
}

/**
 * Abrevia textos longos com reticências.
 */
export function truncate(text: string, maxLength = 100): string {
  if (!text) return ""
  return text.length > maxLength ? text.slice(0, maxLength) + "…" : text
}

/**
 * Capitaliza a primeira letra de uma string.
 */
export function capitalize(text: string): string {
  if (!text) return ""
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Converte string genérica em Genre válido, ou undefined se inválido.
 */
export function parseGenre(value: string | undefined): Genre | undefined {
  if (!value) return undefined
  return GENRES.includes(value as Genre) ? (value as Genre) : undefined
}

/**
 * Converte string genérica em ReadingStatus válido, ou undefined se inválido.
 */
export function parseReadingStatus(value: string | undefined): ReadingStatus | undefined {
  if (!value) return undefined
  const allowed = READING_STATUS.map(s => s.value)
  return allowed.includes(value as ReadingStatus) ? (value as ReadingStatus) : undefined
}
