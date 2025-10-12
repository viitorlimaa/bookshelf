// app/library/page.tsx
import { Suspense } from "react";
import { BookGrid } from "@/components/book-grid";
import { BookGridSkeleton } from "@/components/book-grid-skeleton";
import { LibraryFilters } from "@/components/library-filters";
import { parseGenre, parseReadingStatus } from "@/data/utils";
import type { Book } from "@/data/types";
import { LibraryToaster } from "@/components/ui/client-side";

interface LibraryPageProps {
  searchParams?: {
    query?: string;
    genre?: string;
    status?: string;
  };
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const { query, genre: genreParam, status: statusParam } = searchParams || {};

  const genreObj = parseGenre(genreParam);
  const statusObj = parseReadingStatus(statusParam);

  // 🔹 Busca os livros
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/books`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Erro ao buscar livros");

  let books: Book[] = await res.json();

  // 🔎 Filtro por busca (título ou autor)
  if (query) {
    const q = query.trim().toLowerCase();
    books = books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    );
  }

  //  Filtro por gênero
  if (genreObj) {
    const genreName = genreObj.trim().toLowerCase();

    books = books.filter((b) => {
      const genres = Array.isArray(b.genres)
        ? b.genres
        : b.genres
        ? [b.genres]
        : [];

      return genres.some((g: any) => {
        const name = typeof g === "object" ? g?.name : g;
        return (
          typeof name === "string" && name.trim().toLowerCase() === genreName
        );
      });
    });
  }

  // 📘 Filtro por status
  if (statusObj) {
    const statusValue = statusObj.trim().toLowerCase();

    books = books.filter((b) => {
      const bookStatus = String(b.status || "")
        .trim()
        .toLowerCase();
      return bookStatus === statusValue;
    });
  }

  // 🧱 Renderização
  return (
    <LibraryToaster>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="space-y-2 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-balance">
            Biblioteca
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground text-pretty">
            Explore e gerencie sua coleção de livros
          </p>
        </div>

        <Suspense
          fallback={<div className="text-center">Carregando filtros...</div>}
        >
          <div className="w-full max-w-5xl mx-auto">
            <LibraryFilters /> {/* agora com debounce no input */}
          </div>
        </Suspense>

        <Suspense fallback={<BookGridSkeleton />}>
          <div className="w-full max-w-6xl mx-auto">
            <BookGrid books={books} />
          </div>
        </Suspense>
      </div>
    </LibraryToaster>
  );
}
