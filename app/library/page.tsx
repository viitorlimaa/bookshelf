import { Suspense } from "react";
import { db } from "@/data/db";
import { BookGrid } from "@/components/book-grid";
import { BookGridSkeleton } from "@/components/book-grid-skeleton";
import { LibraryFilters } from "@/components/library-filters";
import { parseGenre, parseReadingStatus } from "@/data/utils";
import type { Book } from "@/data/types";
import { LibraryToaster } from "@/components/ui/client-side";
// nosso wrapper client-side

interface LibraryPageProps {
  searchParams?: {
    query?: string;
    genre?: string;
    status?: string;
  };
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const { query, genre: genreParam, status: statusParam } = searchParams || {};

  const genre = parseGenre(genreParam);
  const status = parseReadingStatus(statusParam);

  let books: Book[] = await db.getAll();

  if (query) {
    books = books.filter(
      (b) =>
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.author.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (genre) {
    books = books.filter((b) => {
      const bookGenres = b.genres ?? (b.genre ? [b.genre] : []);
      return bookGenres.some(
        (g) => typeof g === "string" && g.toLowerCase() === genre.toLowerCase()
      );
    });
  }

  if (status) {
    books = books.filter((b) => b.status === status);
  }

  return (
    <LibraryToaster>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Cabeçalho */}
        <div className="space-y-2 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-balance">
            Biblioteca
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground text-pretty">
            Explore e gerencie sua coleção de livros
          </p>
        </div>

        {/* Filtros */}
        <Suspense fallback={<div className="text-center">Carregando filtros...</div>}>
          <div className="w-full max-w-5xl mx-auto">
            <LibraryFilters />
          </div>
        </Suspense>

        {/* Grade de Livros */}
        <Suspense fallback={<BookGridSkeleton />}>
          <div className="w-full max-w-6xl mx-auto">
            <BookGrid books={books} />
          </div>
        </Suspense>
      </div>
    </LibraryToaster>
  );
}
