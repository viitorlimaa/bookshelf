"use client"

import { useParams } from "next/navigation"
import { useBookStore } from "@/lib/book-store"
import { Navigation } from "@/components/navigation"
import { BookForm } from "@/components/book-form"
import { Button } from "@/components/ui/button"
import { BookOpen, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditBookPage() {
  const params = useParams()
  const { getBookById } = useBookStore()

  const bookId = params.id as string
  const book = getBookById(bookId)

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Livro não encontrado</h1>
            <p className="text-muted-foreground mb-6">
              O livro que você está tentando editar não existe ou foi removido.
            </p>
            <Button asChild>
              <Link href="/biblioteca">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar à Biblioteca
              </Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BookForm book={book} mode="edit" />
      </main>
    </div>
  )
}
