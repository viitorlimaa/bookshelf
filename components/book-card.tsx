import type { Book } from "@/types"

import {Eye, Pencil, Star } from "lucide-react"
import { Badge } from "./ui/badge"
import Link from "next/link"
import Image from "next/image"
import { DeleteBookButton } from "@/components/delete-book-button"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Button } from "./ui/button"

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
          {book.cover ? (
            <Image
              src={book.cover || "/placeholder.svg"}
              alt={`Capa do livro ${book.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <Image
              src={book.cover || "/placeholder-7eydd.png"}
              alt={`Capa do livro ${book.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 p-4">
        <div className="space-y-1">
          <h3 className="font-semibold leading-tight line-clamp-2 text-balance">{book.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {book.year && <span className="text-xs text-muted-foreground">{book.year}</span>}
          {book.genre && (
            <Badge variant="secondary" className="text-xs">
              {book.genre}
            </Badge>
          )}
        </div>

        {book.rating && book.rating > 0 && (
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < book.rating! ? "fill-primary text-primary" : "text-muted-foreground"}`}
              />
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button asChild size="sm" variant="outline" className="flex-1 bg-transparent">
          <Link href={`/book/${book.id}`}>
            <Eye className="mr-2 h-3 w-3" />
            Ver
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href={`/edit/${book.id}`}>
            <Pencil className="h-3 w-3" />
            <span className="sr-only">Editar</span>
          </Link>
        </Button>
        <DeleteBookButton bookId={book.id} bookTitle={book.title} />
      </CardFooter>
    </Card>
  )
}
