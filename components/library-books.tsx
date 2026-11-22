"use client";

import { useLibrary } from "./library-context";
import { BookGrid } from "@/components/book-grid";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { filterBooks } from "@/data/library-filters";

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

  const filteredBooks = useMemo(
    () => filterBooks(books, { query, genre, status }),
    [books, query, genre, status]
  );

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
