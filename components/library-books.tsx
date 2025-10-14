"use client";

import { useEffect, useState } from "react";
import { BookGrid } from "@/components/book-grid";
import { BookGridSkeleton } from "@/components/book-grid-skeleton";
import { LibraryToaster } from "@/components/ui/client-side";
import type { Book } from "@/data/types";

interface LibraryBooksProps {
  searchParams?: {
    query?: string;
    genre?: string;
    status?: string;
  };
}

export function LibraryBooks({ searchParams }: LibraryBooksProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false); // indica se o fetch terminou

  const { query, genre, status } = searchParams || {};

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBooks() {
      setLoading(true);
      try {
        const res = await fetch("/api/books", { signal: controller.signal });
        if (!res.ok) throw new Error("Erro ao buscar livros");
        const data = await res.json();

        const normalized: Book[] = data.map((b: any) => ({
          ...b,
          genres: Array.isArray(b.genres)
            ? b.genres.map((g: any) => g.name)
            : [],
          cover: b.cover || "/placeholder.svg",
          rating: b.rating ?? 0,
          status: b.status ?? undefined,
          year: typeof b.year === "number" ? b.year : undefined,
        }));

        setBooks(normalized);
      } catch (err: any) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        // Garante tempo suficiente para atualização do estado `books`
        setTimeout(() => {
          setLoading(false);
          setFetched(true);
        }, 100);
      }
    }

    fetchBooks();

    return () => controller.abort();
  }, []);

  // 🔹 Aplica filtros apenas depois de carregar completamente
  const filteredBooks =
    fetched && !error
      ? books.filter((b) => {
          let matches = true;

          if (query) {
            const q = query.trim().toLowerCase();
            matches =
              !!(b.title && b.title.toLowerCase().includes(q)) ||
              !!(b.author && b.author.toLowerCase().includes(q));
          }

          if (genre) {
            const g = genre.trim().toLowerCase();
            matches =
              matches && !!b.genres?.some((name) => name.toLowerCase() === g);
          }

          if (status) {
            const s = status.trim().toLowerCase();
            matches = matches && !!(b.status && b.status.toLowerCase() === s);
          }

          return matches;
        })
      : [];

  return (
    <LibraryToaster>
      {/* Estado de carregamento */}
      {loading && <BookGridSkeleton />}

      {/* Estado de erro */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Nenhum resultado encontrado — só mostra se já buscou */}
      {!loading && fetched && !error && books.length > 0 && filteredBooks.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          Nenhum livro encontrado
        </p>
      )}

      {/* Exibe a grade de livros */}
      {!loading && !error && filteredBooks.length > 0 && (
        <BookGrid books={filteredBooks} />
      )}
    </LibraryToaster>
  );
}
