"use server";

import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Calendar, Pencil, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { DeleteBookButton } from "@/components/delete-book-button";
import { getReadingProgress } from "@/data/book-stats";
import type { Book } from "@/data/types";
import { getBook } from "@/lib/books";

export default async function BookDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);

  // Buscar direto do banco
  const bookFromDb = await getBook(String(id));
  if (!bookFromDb) notFound();

  const book: Book = {
    ...bookFromDb,
    genres: bookFromDb.genres || [],
  };

  const genreNames =
    book.genres?.map((g: any) => (typeof g === "string" ? g : g.name)) || [];

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

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/library">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>

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
                <Pencil className="mr-2 h-4 w-4" /> Editar
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
                  {genreNames.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Gênero
                      </p>
                      <Badge variant="secondary">{genreNames.join(", ")}</Badge>
                    </div>
                  )}
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
                  {book.pages && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Páginas
                      </p>
                      <span>{book.pages}</span>
                    </div>
                  )}
                  {book.isbn && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        ISBN
                      </p>
                      <span>{book.isbn}</span>
                    </div>
                  )}
                  {book.rating !== undefined && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Avaliação
                      </p>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{book.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                  {book.status && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Status
                      </p>
                      <Badge>{getStatusLabel(book.status)}</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Progresso de Leitura */}
            <Card>
              <CardHeader>
                <CardTitle>Progresso de Leitura</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={readingProgress} max={100} />
                <p className="mt-2 text-sm text-muted-foreground">
                  {readingProgress}% completo - {getStatusLabel(book.status)}
                </p>
              </CardContent>
            </Card>

            {/* Sinopse */}
            {book.synopsis && (
              <Card>
                <CardHeader>
                  <CardTitle>Sinopse</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{book.synopsis}</p>
                </CardContent>
              </Card>
            )}

            {/* Notas */}
            {book.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{book.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
