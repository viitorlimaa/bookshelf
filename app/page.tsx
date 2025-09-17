"use client";

import { useBookStore } from "@/lib/book-store";
import { ReadingStatus } from "@/lib/types";
import { Navigation } from "@/components/navigation";
import { StatsCard } from "@/components/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  BookMarked,
  CheckCircle,
  FileText,
  Plus,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { date } from "zod";

export default function Dashboard() {
 const { books, getBooksByStatus } = useBookStore();
  const [hydrated, setHydrated] = useState(false);

  // Marcar componente como cliente
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Filtragens e cálculos
  const totalBooks = books.length;
  const currentlyReading = getBooksByStatus(ReadingStatus.LENDO);
  const finishedBooks = getBooksByStatus(ReadingStatus.LIDO);

  const totalPagesRead = useMemo(() => {
    return finishedBooks.reduce((total, book) => total + (book.pages || 0), 0);
  }, [finishedBooks]);

  const recentBooks = useMemo(() => {
    return [...books]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3);
  }, [books]);

  if (!hydrated) return null; // evita SSR/CSR mismatch

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground text-balance">
            Bem-vindo à sua Biblioteca Pessoal
          </h1>
          <p className="text-muted-foreground mt-2 text-pretty">
            Acompanhe seu progresso de leitura e organize seus livros favoritos
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total de Livros"
            value={totalBooks}
            description="Em sua biblioteca"
            icon={BookOpen}
          />
          <StatsCard
            title="Lendo Atualmente"
            value={currentlyReading.length}
            description="Livros em progresso"
            icon={BookMarked}
          />
          <StatsCard
            title="Livros Finalizados"
            value={finishedBooks.length}
            description="Leituras completas"
            icon={CheckCircle}
          />
          <StatsCard
            title="Páginas Lidas"
            value={totalPagesRead.toLocaleString()}
            description="Total acumulado"
            icon={FileText}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Currently Reading */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookMarked className="h-5 w-5 text-primary" />
                Lendo Atualmente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentlyReading.length > 0 ? (
                <div className="space-y-4">
                  {currentlyReading.map((book) => {
                    const progress =
                      book.pages && book.currentPage
                        ? Math.round((book.currentPage / book.pages) * 100)
                        : 0;

                    return (
                      <div
                        key={book.id}
                        className="flex items-center space-x-4 p-4 bg-muted rounded-lg"
                      >
                        <div className="relative h-16 w-12 flex-shrink-0">
                          <Image
                            src={
                              book.cover ||
                              "/placeholder.svg?height=64&width=48&query=book%20cover"
                            }
                            alt={book.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">
                            {book.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {book.author}
                          </p>
                          {book.pages && book.currentPage && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>
                                  {book.currentPage} / {book.pages} páginas
                                </span>
                                <span>{progress}%</span>
                              </div>
                              <div className="w-full bg-border rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nenhum livro sendo lido no momento
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/biblioteca">Escolher um Livro</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBooks.map((book) => (
                  <div key={book.id} className="flex items-center space-x-3">
                    <div className="relative h-12 w-9 flex-shrink-0">
                      <Image
                        src={
                          book.cover ||
                          "/placeholder.svg?height=48&width=36&query=book%20cover"
                        }
                        alt={book.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {book.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {book.author}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Atualizado{" "}
                        {new Date(book.updatedAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2">
                <Button asChild className="w-full">
                  <Link href="/adicionar">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Novo Livro
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="w-full bg-transparent"
                >
                  <Link href="/biblioteca">Ver Toda Biblioteca</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
