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

  const genreObj = parseGenre(genreParam); // retorna um objeto Genre ou undefined
  const status = parseReadingStatus(statusParam);

  // 🔹 Carrega todos os livros via API interna
  const res = await fetch(`http://localhost:3000/api/books`, { cache: "no-store" });
  if (!res.ok) throw new Error("Erro ao buscar livros");
  let books: Book[] = await res.json();

  // 🔎 Filtro por busca
  if (query) {
    const q = query.toLowerCase();
    books = books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q)
    );
  }

  // 🎯 Filtro por gênero
  if (genreObj) {
  const genreName = genreObj.toLowerCase(); // se genreObj for string

  books = books.filter((b) => {
    const genreArray: string[] = b.genres ?? [];
    return genreArray.some((g) => g.toLowerCase() === genreName);
  });
}

  // 📚 Filtro por status
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
