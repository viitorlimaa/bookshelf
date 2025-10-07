// ===============================
//  Tipos e enums
// ===============================

export type ReadingStatus =
  | "QUERO_LER"
  | "LENDO"
  | "LIDO"
  | "PAUSADO"
  | "ABANDONADO";

export interface Genre {
  id: number;
  name: string;
}

export interface Book {
  id: string ;
  title: string;
  author: string;
  genre?: string; 
  genres?: string[];
   genreIds?: number[]; // <-- adicione
  year?: number;
  isbn?: string;
  status?: ReadingStatus;
  pages?: number;
  currentPage?: number;
  rating?: number;
  cover?: string;
  synopsis?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ===============================
//  Constantes
// ===============================

export const GENRES: string[] = [
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
];

export const READING_STATUS: { value: ReadingStatus; label: string }[] = [
  { value: "QUERO_LER", label: "Quero Ler" },
  { value: "LENDO", label: "Lendo" },
  { value: "LIDO", label: "Lido" },
  { value: "PAUSADO", label: "Pausado" },
  { value: "ABANDONADO", label: "Abandonado" },
];
