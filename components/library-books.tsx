"use client";

import { useLibrary } from "./library-context";
import { BookGrid } from "@/components/book-grid";
import { BookGridSkeleton } from "@/components/book-grid-skeleton";

interface LibraryBooksProps {
  searchParams?: {
    query?: string;
    genre?: string;
    status?: string;
  };
}

export function LibraryBooks({ searchParams }: LibraryBooksProps) {
  const { books, removeBook } = useLibrary();
  const { query, genre, status } = searchParams || {};

  // Filtragem
  const filteredBooks = books.filter((b) => {
    let matches = true;

    if (query) {
      const q = query.trim().toLowerCase();
      matches =
        !!(b.title && b.title.toLowerCase().includes(q)) ||
        !!(b.author && b.author.toLowerCase().includes(q));
    }

    if (genre) {
      const g = genre.trim().toLowerCase();
      matches = matches && !!b.genres?.some((name) => name.toLowerCase() === g);
    }

    if (status) {
      const s = status.trim().toLowerCase();
      matches = matches && !!(b.status && b.status.toLowerCase() === s);
    }

    return matches;
  });

  if (books.length === 0) return <BookGridSkeleton />;

  return filteredBooks.length === 0 ? (
    <p className="text-center text-muted-foreground py-12">
      Nenhum livro encontrado
    </p>
  ) : (
    <BookGrid books={filteredBooks} onDelete={(id) => removeBook(Number(id))} />
  );
}
