import type { Book } from "./types";

export interface BookFilters {
  query?: string;
  genre?: string;
  status?: string;
}

export function filterBooks(
  books: Book[],
  { query = "", genre = "", status = "" }: BookFilters = {}
): Book[] {
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedGenre =
    genre.trim().toLowerCase() === "all" ? "" : genre.trim().toLowerCase();
  const normalizedStatus =
    status.trim().toLowerCase() === "all" ? "" : status.trim().toLowerCase();

  return books.filter((book) => {
    const matchesQuery =
      !normalizedQuery ||
      book.title.toLowerCase().includes(normalizedQuery) ||
      book.author.toLowerCase().includes(normalizedQuery);
    const matchesGenre =
      !normalizedGenre ||
      !!book.genres?.some((name) => name.toLowerCase() === normalizedGenre);
    const matchesStatus =
      !normalizedStatus || book.status?.toLowerCase() === normalizedStatus;

    return matchesQuery && matchesGenre && matchesStatus;
  });
}
