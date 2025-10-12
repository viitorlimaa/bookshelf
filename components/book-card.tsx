import type { Book } from "@/data/types";
import { Eye, Pencil, Star } from "lucide-react";
import { Badge } from "./ui/badge";
import Link from "next/link";
import Image from "next/image";
import { DeleteBookButton } from "@/components/delete-book-button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  // Normaliza genres para sempre ser um array de strings
  const normalizedGenres: string[] = Array.isArray(book.genres)
    ? book.genres.map((g) => (typeof g === "string" ? g : (g as any).name))
    : [];

  const genreName = normalizedGenres[0] || "";
  const rating = book.rating ?? 0;
  const cover = book.cover || "/placeholder.svg";
  const status = book.status || "QUERO_LER";

  return (
    <Card className="group flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-border">
      {/* Capa */}
      <CardHeader className="p-0">
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
          <Image
            src={cover}
            alt={`Capa do livro ${book.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
        </div>
      </CardHeader>

      {/* Conteúdo */}
      <CardContent className="flex-1 space-y-3.5 p-5">
        <div className="space-y-1.5">
          <h3 className="font-semibold text-base leading-tight line-clamp-2 text-balance text-foreground group-hover:text-primary transition-colors duration-200">
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
        </div>

        {/* Gênero e Ano */}
        <div className="flex flex-wrap items-center gap-2">
          {genreName && (
            <Badge
              variant="secondary"
              className="text-xs font-medium px-2.5 py-0.5 rounded-md"
            >
              {genreName}
            </Badge>
          )}
          {book.year && (
            <span className="text-xs font-medium text-muted-foreground/80 bg-muted/50 px-2 py-0.5 rounded-md">
              {book.year}
            </span>
          )}
        </div>

        {/* Status de leitura */}
        {status && (
          <div className="inline-flex items-center text-xs font-semibold text-primary bg-primary/10 rounded-lg px-3 py-1.5 border border-primary/20">
            {status
              .replace("_", " ")
              .toLowerCase()
              .replace(/\b\w/g, (l) => l.toUpperCase())}
          </div>
        )}

        {/* Avaliação (Estrelas) */}
        <div className="flex items-center gap-0.5 pt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 transition-all duration-200 ${
                i < rating
                  ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                  : "fill-transparent text-muted-foreground/30"
              }`}
            />
          ))}
          {rating > 0 && (
            <span className="ml-1.5 text-xs font-medium text-muted-foreground">
              {rating.toFixed(1)}
            </span>
          )}
        </div>
      </CardContent>

      {/* Ações */}
      <CardFooter className="flex gap-2 p-5 pt-0 transition-colors duration-300">
        <Button
          asChild
          size="sm"
          variant="outline"
          className="flex-1 font-medium bg-transparent"
        >
          <Link href={`/book/${book.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            Ver
          </Link>
        </Button>

        <Button
          asChild
          size="sm"
          variant="outline"
          className="font-medium bg-transparent"
        >
          <Link href={`/edit/${book.id}`}>
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>

        <DeleteBookButton bookId={book.id} bookTitle={book.title} />
      </CardFooter>
    </Card>
  );
}
