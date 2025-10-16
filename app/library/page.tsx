// app/library/page.tsx
import { Suspense } from "react";
import { LibraryProvider } from "@/components/library-context";
import { LibraryFilters } from "@/components/library-filters";
import { LibraryBooks } from "@/components/library-books";
import { LibraryToaster } from "@/components/ui/client-side";
import { getBooks } from "@/lib/books";

interface LibraryPageProps {
  searchParams?: {
    query?: string;
    genre?: string;
    status?: string;
  };
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const books = await getBooks();
  const normalized = books.map((b: any) => ({
    ...b,
    id: String(b.id),
    genres: b.genres?.map((g: any) => g.name) || [],
    cover: b.cover || "/placeholder.svg",
    rating: b.rating ?? 0,
    status: b.status ?? undefined,
    year: typeof b.year === "number" ? b.year : undefined,
  }));

  return (
    <LibraryToaster>
      {/*  Client-side context */}
      <LibraryProvider initialBooks={normalized}>
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

          <Suspense
            fallback={<div className="text-center">Carregando livros...</div>}
          >
            <div className="w-full max-w-6xl mx-auto">
              <LibraryBooks searchParams={searchParams} />
            </div>
          </Suspense>
        </div>
      </LibraryProvider>
    </LibraryToaster>
  );
}
