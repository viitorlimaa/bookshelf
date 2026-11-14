import type { Book } from "@/data/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE!;
// Keep the upstream wait short enough for Next.js to render its error boundary.
const READ_TIMEOUT_MS = 8_000;

export const BOOKS_CACHE_TAG = "books";
export const bookCacheTag = (id: string) => `book:${id}`;

export async function getBooks(): Promise<Book[]> {
  const res = await fetch(`${BASE_URL}/books`, {
    next: { revalidate: 60, tags: [BOOKS_CACHE_TAG] },
    signal: AbortSignal.timeout(READ_TIMEOUT_MS),
  });

  if (!res.ok) throw new Error("Erro ao buscar livros");
  return res.json();
}

export async function getBook(id: string): Promise<Book> {
  const res = await fetch(`${BASE_URL}/books/${id}`, {
    next: { revalidate: 60, tags: [bookCacheTag(id)] },
    signal: AbortSignal.timeout(READ_TIMEOUT_MS),
  });

  if (!res.ok) throw new Error("Erro ao buscar livro");
  return res.json();
}

export async function getGenres() {
  const res = await fetch(`${BASE_URL}/genres`, {
    next: { revalidate: 60, tags: ["genres"] },
    signal: AbortSignal.timeout(READ_TIMEOUT_MS),
  });

  if (!res.ok) throw new Error("Erro ao buscar gêneros");
  return res.json();
}
