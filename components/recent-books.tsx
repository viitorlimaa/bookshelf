import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "./ui/badge"
import type { Book } from "@/data/types"
import Link from "next/link"
import { Star } from "lucide-react"

interface RecentBooksProps {
  books: Book[]
}

export function RecentBooks({ books }: RecentBooksProps) {
  const recentBooks = books
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
        <CardDescription>Livros atualizados recentemente</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentBooks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum livro cadastrado ainda</p>
        ) : (
          recentBooks.map((book) => (
            <Link
              key={book.id}
              href={`/book/${book.id}`}
              className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent"
            >
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{book.title}</p>
                <p className="text-sm text-muted-foreground">{book.author}</p>
                <div className="flex items-center gap-2">
                  {book.status && (
                    <Badge variant="outline" className="text-xs">
                      {book.status === "LENDO" && "Lendo"}
                      {book.status === "LIDO" && "Lido"}
                      {book.status === "QUERO_LER" && "Quero Ler"}
                      {book.status === "PAUSADO" && "Pausado"}
                      {book.status === "ABANDONADO" && "Abandonado"}
                    </Badge>
                  )}
                  {book.rating && book.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      <span className="text-xs text-muted-foreground">{book.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  )
}
