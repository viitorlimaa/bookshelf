import { describe, expect, it } from "vitest";
import { calculateBookStats, getReadingProgress } from "./book-stats";
import { filterBooks } from "./library-filters";
import type { ApiBook, Book } from "./types";
import { normalizeBook, parseReadingStatus } from "./utils";

const books: Book[] = [
  {
    id: "1",
    title: "Grande Sertao: Veredas",
    author: "Joao Guimaraes Rosa",
    genres: ["Ficcao", "Classicos"],
    status: "LIDO",
    pages: 500,
    currentPage: 120,
  },
  {
    id: "2",
    title: "Cem Anos de Solidao",
    author: "Gabriel Garcia Marquez",
    genres: ["Ficcao"],
    status: "LENDO",
    pages: 400,
    currentPage: 100,
  },
  {
    id: "3",
    title: "Uma Breve Historia do Tempo",
    author: "Stephen Hawking",
    genres: ["Ciencia"],
    status: "QUERO_LER",
  },
];

describe("calculateBookStats", () => {
  it("soma as paginas totais para livros lidos e a pagina atual para livros em leitura", () => {
    expect(calculateBookStats(books)).toEqual({
      total: 3,
      reading: 1,
      finished: 1,
      totalPages: 600,
    });
  });

  it("retorna estatisticas zeradas para uma biblioteca vazia", () => {
    expect(calculateBookStats([])).toEqual({
      total: 0,
      reading: 0,
      finished: 0,
      totalPages: 0,
    });
  });
});

describe("getReadingProgress", () => {
  it("retorna zero sem total de paginas e 100 quando a leitura foi concluida", () => {
    expect(getReadingProgress({ ...books[1], pages: undefined })).toBe(0);
    expect(getReadingProgress({ ...books[1], currentPage: 400 })).toBe(100);
  });
});

describe("normalizeBook", () => {
  it("normaliza generos, capa vazia e rating nulo", () => {
    const apiBook: ApiBook = {
      id: 42,
      title: "Livro",
      author: "Autora",
      genres: [
        { id: 1, name: "Fantasia" },
        { id: 2, name: "Aventura" },
      ],
      cover: "",
      rating: null,
    };

    expect(normalizeBook(apiBook)).toMatchObject({
      id: "42",
      genres: ["Fantasia", "Aventura"],
      cover: "/placeholder.svg",
      rating: 0,
    });
  });
});

describe("parseReadingStatus", () => {
  it("aceita status conhecidos e rejeita valores ausentes ou invalidos", () => {
    expect(parseReadingStatus("LIDO")).toBe("LIDO");
    expect(parseReadingStatus("INVALIDO")).toBeUndefined();
    expect(parseReadingStatus(undefined)).toBeUndefined();
  });
});

describe("filterBooks", () => {
  it("retorna todos os livros quando genero e status sao all", () => {
    expect(filterBooks(books, { genre: "all", status: "all" })).toEqual(books);
  });

  it("combina filtros de genero e status", () => {
    expect(filterBooks(books, { genre: "ficcao", status: "lendo" })).toEqual([
      books[1],
    ]);
  });

  it("busca por autor sem diferenciar maiusculas de minusculas", () => {
    expect(filterBooks(books, { query: "GABRIEL GARCIA" })).toEqual([books[1]]);
    expect(filterBooks(books, { query: "rosa" })).toEqual([books[0]]);
  });
});
