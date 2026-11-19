// app/library/page.tsx
import { Suspense } from "react";
import { LibraryProvider } from "@/components/library-context";
import { LibraryFilters } from "@/components/library-filters";
import { LibraryBooks } from "@/components/library-books";
import { getBooks } from "@/lib/reads";
import { BookGridSkeleton } from "@/components/book-grid-skeleton";
import { normalizeBook } from "@/data/utils";

export const dynamic = "force-dynamic";

export default function LibraryPage() {
  return (
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
        <LibraryContent />
      </Suspense>
    </div>
  );
}

async function LibraryContent() {
  const books = await getBooks();
  const normalized = books.map(normalizeBook);

  return (
    <LibraryProvider initialBooks={normalized}>
      <div className="w-full max-w-6xl mx-auto">
        <LibraryBooks />
      </div>
    </LibraryProvider>
  );
}
