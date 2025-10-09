import { db } from "@/data/db";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Hash,
  Pencil,
  Star,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { DeleteBookButton } from "@/components/delete-book-button";
import { getReadingProgress } from "@/data/book-stats";
import { getGenresServer } from "@/data/get-genres";

export default async function BookDetailsPage({
  params,
}: {
  params: { id: number };
}) {
  const { id } = params;
  const book = await db.getById(id);
  if (!book) notFound();

  const genres = await getGenresServer(); // ✅ fetch server-side

  const readingProgress = getReadingProgress(book);

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "LENDO":
        return "Lendo";
      case "LIDO":
        return "Lido";
      case "QUERO_LER":
        return "Quero Ler";
      case "PAUSADO":
        return "Pausado";
      case "ABANDONADO":
        return "Abandonado";
      default:
        return "Não definido";
    }
  };

 // mapear os ids do livro para os nomes dos gêneros
const genreNames =
  book.genreIds?.map((id) => genres.find((g) => g.id === id)?.name).filter(Boolean) || [];


  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2">
          <div className="flex-shrink-0">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/library">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Voltar</span>
              </Link>
            </Button>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
              {book.title}
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground">
              {book.author}
            </p>
          </div>

          <div className="flex justify-center sm:justify-end gap-2 mt-2 sm:mt-0">
            <Button asChild variant="outline">
              <Link href={`/edit/${book.id}`}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
            <DeleteBookButton bookId={book.id} bookTitle={book.title} />
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {/* Capa */}
          <div className="md:col-span-1 w-full">
            <Card className="overflow-hidden w-full">
              <div className="relative aspect-[2/3] w-full">
                {book.cover ? (
                  <Image
                    src={book.cover}
                    alt={book.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted">
                    <span className="text-muted-foreground">Sem capa</span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Informações */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Livro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Gênero
                    </p>
                    <Badge variant="secondary">{genreName}</Badge>
                  </div>
                  {book.year && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Ano de Publicação
                      </p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{book.year}</span>
                      </div>
                    </div>
                  )}
                  {/* outras infos... */}
                </div>
              </CardContent>
            </Card>
            {/* Progresso e Sinopse podem permanecer igual */}
          </div>
        </div>
      </div>
    </div>
  );
}
