import { Book } from "./types";

export function calculateBookStats(books: Book[]) {
  const total = books.length;
  const reading = books.filter((book) => book.status === "LENDO").length;
  const finished = books.filter((book) => book.status === "LIDO").length;

  const totalPages = books.reduce((sum, book) => {
    if (book.status === "LIDO") return sum + (book.pages || 0);
    if (book.currentPage && book.currentPage > 0) return sum + book.currentPage;
    return sum;
  }, 0);

  return { total, reading, finished, totalPages };
}

export function getReadingProgress(book: Book): number {
  if (!book.pages || !book.currentPage) return 0;
  return Math.round((book.currentPage / book.pages) * 100);
}
