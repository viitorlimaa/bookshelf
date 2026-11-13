import type { Book } from "@/data/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE!;

export const BOOKS_CACHE_TAG = "books";
export const bookCacheTag = (id: string) => `book:${id}`;

export async function getBooks(): Promise<Book[]> {
  const res = await fetch(`${BASE_URL}/books`, {
    next: { revalidate: 60, tags: [BOOKS_CACHE_TAG] },
  });

  if (!res.ok) throw new Error("Erro ao buscar livros");
  return res.json();
}

export async function getBook(id: string): Promise<Book> {
  const res = await fetch(`${BASE_URL}/books/${id}`, {
    next: { revalidate: 60, tags: [bookCacheTag(id)] },
  });

  if (!res.ok) throw new Error("Erro ao buscar livro");
  return res.json();
}

export async function getGenres() {
  const res = await fetch(`${BASE_URL}/genres`, {
    next: { revalidate: 60, tags: ["genres"] },
  });

  if (!res.ok) throw new Error("Erro ao buscar gêneros");
  return res.json();
}
