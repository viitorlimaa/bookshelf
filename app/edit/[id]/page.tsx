// app/edit/[id]/page.tsx
"use server";

import { getBook } from "@/app/api/books/[id]/route";
import { getGenres } from "@/app/api/categories/genres/route";
import { BookForm } from "@/components/book-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface EditBookPageProps {
  params: { id: string };
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const id = Number(params.id);

  // Buscar livro direto do banco
  const book = await getBook(id);

  if (!book) notFound();

  // Buscar todos os gêneros
  const genres = await getGenres();

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/library">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
              Editar Livro
            </h1>
            <p className="text-muted-foreground text-pretty">
              Atualize as informações do livro
            </p>
          </div>
        </div>

        <BookForm book={book} genresFromDb={genres} />
      </div>
    </div>
  );
}
