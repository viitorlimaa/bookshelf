import { db } from "@/db";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { getReadingProgress } from "@/lib/book-stats";

interface BookDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BookDetailsPage({
  params,
}: BookDetailsPageProps) {
  const { id } = await params;
  const book = await db.getById(id);

  if (!book) {
    notFound();
  }

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
    <div className="container max-w-5xl py-8 space-y-8 px-4 sm:px-6 lg:px-8">
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
            <Link href={`/editar/${book.id}`}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          <DeleteBookButton bookId={book.id} bookTitle={book.title} />
        </div>
      </div>

      {/* Grid de capa e info */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* Capa */}
        <div className="md:col-span-1 w-full">
          <Card className="overflow-hidden w-full">
            <div className="relative aspect-[2/3] w-full">
              {book.cover ? (
                <Image
                  src={book.cover || "/placeholder.svg"}
                  alt={`Capa do livro ${book.title}`}
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
                {book.genre && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Gênero
                    </p>
                    <Badge variant="secondary">{book.genre}</Badge>
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
                      Total de Páginas
                    </p>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{book.pages} páginas</span>
                    </div>
                  </div>
                )}

                {book.isbn && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      ISBN
                    </p>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-sm">{book.isbn}</span>
                    </div>
                  </div>
                )}
              </div>

              {book.rating && book.rating > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Avaliação
                  </p>
                  <div className="flex flex-wrap items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < book.rating!
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {book.rating} de 5 estrelas
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {book.status && (
            <Card>
              <CardHeader>
                <CardTitle>Progresso de Leitura</CardTitle>
                <CardDescription>{getStatusLabel(book.status)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {book.pages && book.currentPage !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Página atual
                      </span>
                      <span className="font-medium">
                        {book.currentPage} de {book.pages}
                      </span>
                    </div>
                    <Progress value={readingProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right">
                      {readingProgress}% completo
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      book.status === "LIDO"
                        ? "default"
                        : book.status === "LENDO"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {getStatusLabel(book.status)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Sinopse */}
      {book.synopsis && (
        <Card>
          <CardHeader>
            <CardTitle>Sinopse</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed text-pretty">
              {book.synopsis}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Notas */}
      {book.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notas Pessoais</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed text-pretty">
              {book.notes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
