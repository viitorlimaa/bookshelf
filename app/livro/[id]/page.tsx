"use client"

import { useParams, useRouter } from "next/navigation"
import { useBookStore } from "@/lib/book-store"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Trash2, Star, Calendar, BookOpen, FileText, User, Hash } from "lucide-react"
import { ReadingStatus, STATUS_LABELS } from "@/lib/types"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import React from "react"

export default function BookDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { getBookById, deleteBook } = useBookStore()

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
            <p className="text-muted-foreground mb-6">O livro que você está procurando não existe ou foi removido.</p>
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

  const renderStars = (rating?: number) => {
   if (!rating || rating < 1 ) return null

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={cn("h-4 w-4", i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-2">{rating}/5</span>
      </div>
    )
  }

  const getStatusColor = (status: ReadingStatus) => {
    switch (status) {
      case ReadingStatus.LENDO:
        return "bg-blue-100 text-blue-800 border-blue-200"
      case ReadingStatus.LIDO:
        return "bg-green-100 text-green-800 border-green-200"
      case ReadingStatus.QUERO_LER:
        return "bg-purple-100 text-purple-800 border-purple-200"
      case ReadingStatus.PAUSADO:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case ReadingStatus.ABANDONADO:
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir este livro? Esta ação não pode ser desfeita.")) {
      deleteBook(book.id)
      router.push("/biblioteca")
    }
  }

  const readingProgress = book.pages && book.currentPage ? Math.round((book.currentPage / book.pages) * 100) : 0

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" asChild>
            <Link href="/biblioteca">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar à Biblioteca
            </Link>
          </Button>

          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/editar/${book.id}`}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Link>
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover and Basic Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Cover Image */}
                  <div className="aspect-[3/4] relative mx-auto max-w-sm">
                    <Image
                      src={book.cover || "/placeholder.svg?height=400&width=300&query=book%20cover"}
                      alt={book.title}
                      fill
                      className="object-cover rounded-lg shadow-lg"
                    />
                  </div>

                  {/* Status Badge */}
                  <div className="text-center">
                    <Badge className={cn("text-sm px-3 py-1", getStatusColor(book.status))}>
                      {STATUS_LABELS[book.status]}
                    </Badge>
                  </div>

                  {/* Reading Progress */}
                  {book.status === ReadingStatus.LENDO && book.pages && book.currentPage && (
                    <div className="space-y-3">
                      <Separator />
                      <div>
                        <h3 className="font-medium text-foreground mb-2">Progresso de Leitura</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>
                              {book.currentPage} / {book.pages} páginas
                            </span>
                            <span>{readingProgress}%</span>
                          </div>
                          <div className="w-full bg-border rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${readingProgress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rating */}
                  { book.rating && (
                    <div className="space-y-2">
                      <Separator />
                      <div>
                        <h3 className="font-medium text-foreground mb-2">Avaliação</h3>
                        {renderStars(book.rating)}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Author */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground text-balance mb-2">{book.title}</h1>
                    <div className="flex items-center gap-2 text-lg text-muted-foreground">
                      <User className="h-5 w-5" />
                      <span>{book.author}</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                    {book.year && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{book.year}</span>
                      </div>
                    )}

                    {book.pages && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>{book.pages} páginas</span>
                      </div>
                    )}

                    {book.isbn && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Hash className="h-4 w-4" />
                        <span>{book.isbn}</span>
                      </div>
                    )}
                  </div>

                  {/* Genre */}
                  {book.genre && (
                    <div className="pt-2">
                      <Badge variant="secondary">{book.genre}</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Synopsis */}
            {book.synopsis && (
              <Card>
                <CardHeader>
                  <CardTitle>Sinopse</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-pretty">{book.synopsis}</p>
                </CardContent>
              </Card>
            )}

            {/* Personal Notes */}
            {book.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Minhas Anotações</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-pretty">{book.notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Reading History */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Adicionado em:</span>
                    <span>
                      {new Date(book.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Última atualização:</span>
                    <span>
                      {new Date(book.updatedAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
