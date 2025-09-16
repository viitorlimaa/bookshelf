export interface Book {
  id: string
  title: string
  author: string
  genre?: string
  year?: number
  pages?: number
  currentPage?: number
  rating?: number
  synopsis?: string
  cover?: string
  isbn?: string
  notes?: string
  status: ReadingStatus
  createdAt: Date
  updatedAt: Date
}

export enum ReadingStatus {
  QUERO_LER = "QUERO_LER",
  LENDO = "LENDO",
  LIDO = "LIDO",
  PAUSADO = "PAUSADO",
  ABANDONADO = "ABANDONADO",
}

export const GENRES = [
  "Literatura Brasileira",
  "Ficção Científica",
  "Realismo Mágico",
  "Ficção",
  "Fantasia",
  "Romance",
  "Biografia",
  "História",
  "Autoajuda",
  "Tecnologia",
  "Programação",
  "Negócios",
  "Psicologia",
  "Filosofia",
  "Poesia",
] as const

export const STATUS_LABELS = {
  [ReadingStatus.QUERO_LER]: "Quero Ler",
  [ReadingStatus.LENDO]: "Lendo",
  [ReadingStatus.LIDO]: "Lido",
  [ReadingStatus.PAUSADO]: "Pausado",
  [ReadingStatus.ABANDONADO]: "Abandonado",
} as const
