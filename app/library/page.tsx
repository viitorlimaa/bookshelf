import { db } from "@/db"
import { BookGrid } from "@/components/book-grid"
import { LibraryFilters } from "@/components/library-filters"
import { Suspense } from "react"
import { BookGridSkeleton } from "@/components/book-grid-skeleton"
import { parseGenre, parseReadingStatus } from "@/lib/utils"

interface LibraryPageProps {
  searchParams: Promise<{
    query?: string
    genre?: string
    status?: string
  }>
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const params = await searchParams
  const { query, genre: genreParam, status: statusParam } = params

  // Converte strings para tipos corretos
  const genre = parseGenre(genreParam)
  const status = parseReadingStatus(statusParam)

  let books = await db.getAll()

  // Aplica filtros
  if (query) {
    books = await db.search(query)
  } else if (genre) {
    books = await db.filterByGenre(genre)
  } else if (status) {
    books = await db.filterByStatus(status)
  }

  return (
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
);

}
