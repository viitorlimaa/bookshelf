export type ReadingStatus = "QUERO_LER" | "LENDO" | "LIDO" | "PAUSADO" | "ABANDONADO"

export type Genre =
  | "Literatura Brasileira"
  | "Ficção Científica"
  | "Realismo Mágico"
  | "Ficção"
  | "Fantasia"
  | "Romance"
  | "Biografia"
  | "História"
  | "Autoajuda"
  | "Tecnologia"
  | "Programação"
  | "Negócios"
  | "Psicologia"
  | "Filosofia"
  | "Poesia"

export interface Book {
  id: string;
  title: string;
  author: string;
  genre?: string;
  year?: number;
  isbn?: string;
  status?: string;
  pages?: number;
  currentPage?: number;
  rating?: number;
  cover?: string;
  synopsis?: string;
  notes?: string;
  createdAt: string; // ISO string (ex: "2025-10-04T18:00:00.000Z")
  updatedAt: string; // ISO string
}


export const GENRES: Genre[] = [
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
]

export const READING_STATUS: { value: ReadingStatus; label: string }[] = [
  { value: "QUERO_LER", label: "Quero Ler" },
  { value: "LENDO", label: "Lendo" },
  { value: "LIDO", label: "Lido" },
  { value: "PAUSADO", label: "Pausado" },
  { value: "ABANDONADO", label: "Abandonado" },
]
