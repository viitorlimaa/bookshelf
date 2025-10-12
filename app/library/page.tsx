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

  const booksFromApi = await res.json();

  // 🔹 Normaliza os livros para compatibilidade com BookCard e filtros
  const normalizedBooks: Book[] = booksFromApi.map((b: any) => ({
    ...b,
    genres: Array.isArray(b.genres)
      ? b.genres.map((g: { id: number; name: string }) => g.name ?? "")
      : [],
    cover: b.cover || "/placeholder.svg",
    rating: b.rating ?? 0,
    status: b.status ?? undefined,
    year: typeof b.year === "number" ? b.year : undefined,
  }));

  // 🔎 Filtro por busca (título ou autor)
  let filteredBooks = normalizedBooks;
  if (query) {
    const q = query.trim().toLowerCase();
    filteredBooks = filteredBooks.filter(
      (b) =>
        b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    );
  }

  // 🔹 Filtro por gênero
  if (genreObj) {
    const genreName = genreObj.trim().toLowerCase();
    filteredBooks = filteredBooks.filter((b) =>
      b.genres?.some((g) => g.toLowerCase() === genreName)
    );
  }

  // 🔹 Filtro por status
  if (statusObj) {
    const statusValue = statusObj.trim().toLowerCase();
    filteredBooks = filteredBooks.filter(
      (b) => b.status?.toLowerCase() === statusValue
    );
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
            <LibraryFilters />
          </div>
        </Suspense>

        <Suspense fallback={<BookGridSkeleton />}>
          <div className="w-full max-w-6xl mx-auto">
            <BookGrid books={filteredBooks} />
          </div>
        </Suspense>
      </div>
    </LibraryToaster>
  );
}
