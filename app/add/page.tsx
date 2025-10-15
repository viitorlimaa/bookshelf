// app/add/page.tsx
import { BookForm } from "@/components/book-form";
import { Button } from "@/components/ui/button";
import { getGenres } from "@/lib/genres";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AddBookPage() {
  // Buscar todos os gêneros
  const genres = await getGenres();

  return (
    <div className="min-h-screen flex flex-col items-center bg-background px-4 sm:px-6 lg:px-8 py-12">
      {/* Header com botão de voltar */}
      <div className="flex items-center w-full max-w-3xl mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/library">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <div className="ml-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
            Adicionar Novo Livro
          </h1>
          <p className="mt-1 text-sm sm:text-base text-muted-foreground">
            Preencha as informações do livro para adicionar à sua biblioteca
          </p>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-card rounded-lg shadow-md p-8">
        <BookForm genresFromDb={genres} />
      </div>
    </div>
  );
}
