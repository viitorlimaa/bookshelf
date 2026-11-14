"use client";

import { useLibrary } from "./library-context";
import { BookGrid } from "@/components/book-grid";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

interface LibraryBooksProps {
  searchParams?: {
    query?: string;
    genre?: string;
    status?: string;
  };
}

export function LibraryBooks({
  searchParams: pageSearchParams,
}: LibraryBooksProps) {
  const { books, removeBook } = useLibrary();
  const urlSearchParams = useSearchParams();
  const query = pageSearchParams?.query ?? urlSearchParams.get("query") ?? "";
  const genre = pageSearchParams?.genre ?? urlSearchParams.get("genre") ?? "";
  const status = pageSearchParams?.status ?? urlSearchParams.get("status") ?? "";

  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedGenre =
      genre.trim().toLowerCase() === "all" ? "" : genre.trim().toLowerCase();
    const normalizedStatus =
      status.trim().toLowerCase() === "all"
        ? ""
        : status.trim().toLowerCase();

    return books.filter((b) => {
      const matchesQuery =
        !normalizedQuery ||
        b.title.toLowerCase().includes(normalizedQuery) ||
        b.author.toLowerCase().includes(normalizedQuery);
      const matchesGenre =
        !normalizedGenre ||
        !!b.genres?.some((name) => name.toLowerCase() === normalizedGenre);
      const matchesStatus =
        !normalizedStatus || b.status?.toLowerCase() === normalizedStatus;

      return matchesQuery && matchesGenre && matchesStatus;
    });
  }, [books, query, genre, status]);

  if (books.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-12">
        Nenhum livro cadastrado ainda
      </p>
    );
  }

  return filteredBooks.length === 0 ? (
    <p className="text-center text-muted-foreground py-12">
      Nenhum livro encontrado com os filtros selecionados
    </p>
  ) : (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {filteredBooks.length} {filteredBooks.length === 1 ? "livro" : "livros"}
      </p>
      <BookGrid
        books={filteredBooks}
        onDelete={(id) => removeBook(String(id))}
      />
    </div>
  );
}
