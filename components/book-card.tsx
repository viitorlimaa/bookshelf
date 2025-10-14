import type { Book } from "@/data/types";
import { Eye, Pencil, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { DeleteBookButton } from "@/components/delete-book-button";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface BookCardProps {
  book: Book;
  onDelete?: (bookId: string) => void;
}

export function BookCard({ book, onDelete }: BookCardProps) {
  const genres = Array.isArray(book.genres)
    ? book.genres.map((g) => (typeof g === "string" ? g : (g as any).name))
    : [];
  const genreName = genres[0] || "";
  const rating = book.rating ?? 0;
  const cover = book.cover || "/placeholder.svg";
  const status = book.status || "QUERO_LER";

  return (
    <Card className="group flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-border">
      <CardHeader className="p-0">
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
          <Image src={cover} alt={book.title} fill className="object-cover" />
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3.5 p-5">
        <h3 className="font-semibold text-base line-clamp-2">{book.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {book.author}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {genreName && <Badge variant="secondary">{genreName}</Badge>}
          {book.year && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-muted/50">
              {book.year}
            </span>
          )}
        </div>

        {status && (
          <div className="inline-flex items-center text-xs font-semibold text-primary bg-primary/10 rounded-lg px-3 py-1.5 border border-primary/20">
            {status
              .replace("_", " ")
              .toLowerCase()
              .replace(/\b\w/g, (l) => l.toUpperCase())}
          </div>
        )}

        <div className="flex items-center gap-0.5 pt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-transparent text-muted-foreground/30"
              }`}
            />
          ))}
          {rating > 0 && (
            <span className="ml-1.5 text-xs text-muted-foreground">
              {rating.toFixed(1)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 p-5 pt-0">
        <Button asChild size="sm" variant="outline" className="flex-1">
          <Link href={`/book/${book.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            Ver
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href={`/edit/${book.id}`}>
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>

        <DeleteBookButton
          bookId={book.id}
          bookTitle={book.title}
          onDelete={onDelete}
        />
      </CardFooter>
    </Card>
  );
}
