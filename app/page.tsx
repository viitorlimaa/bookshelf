"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useBookStore } from "@/lib/book-store";
import { ReadingStatus } from "@/lib/types";
import { Navigation } from "@/components/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  BookMarked,
  CheckCircle,
  FileText,
  Plus,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  // store / dados (não alterei nada do seu store)
  const books = useBookStore((s) => s.books);
  const { getBooksByStatus } = useBookStore();

  // ref do container para observar imagens do DOM
  const rootRef = useRef<HTMLDivElement | null>(null);

  // mounted para evitar SSR mismatch
  const [mounted, setMounted] = useState(false);

  // isReady = true quando a "página está pronta" (imagens carregadas)
  const [isReady, setIsReady] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    const container = rootRef.current ?? document;
    const imgs = Array.from(container.querySelectorAll("img"));

    if (imgs.length === 0) {
      // nada para esperar: pronto imediatamente
      setIsReady(true);
      return;
    }

    let completed = 0;
    let done = false;

    const checkDone = () => {
      if (done) return;
      if (completed >= imgs.length) {
        done = true;
        setIsReady(true);
      }
    };

    const onLoadOrError = () => {
      completed += 1;
      checkDone();
    };

    // marca imagens já completas
    imgs.forEach((img) => {
      if ((img as HTMLImageElement).complete) {
        completed += 1;
      } else {
        img.addEventListener("load", onLoadOrError);
        img.addEventListener("error", onLoadOrError);
      }
    });

    checkDone();

    // fallback por segurança (10s)
    const timer = setTimeout(() => {
      if (!done) {
        done = true;
        setIsReady(true);
      }
    }, 10000);

    return () => {
      clearTimeout(timer);
      imgs.forEach((img) => {
        img.removeEventListener("load", onLoadOrError);
        img.removeEventListener("error", onLoadOrError);
      });
    };
  }, [mounted, books]); // re-observa se books mudar (novas imagens)

  // --- cálculos / hooks (sempre no topo, não dentro de `if`) ---
  const totalBooks = books.length;
  const currentlyReading = getBooksByStatus(ReadingStatus.LENDO);
  const finishedBooks = getBooksByStatus(ReadingStatus.LIDO);

  const totalPagesRead = useMemo(() => {
    return finishedBooks.reduce((total, book) => total + (book.pages || 0), 0);
  }, [finishedBooks]);

  const recentBooks = useMemo(() => {
    return [...books]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 3);
  }, [books]);

  // evita SSR/CSR mismatch
  if (!mounted) return null;

  // --- RENDER: sempre renderiza o conteúdo (para as imagens iniciarem o download),
  // mas exibe um overlay com spinner até isReady === true ---
  return (
    <div ref={rootRef} className="min-h-screen bg-background relative">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* === seu conteúdo original (copie/cole sua página inteira aqui) === */}

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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Total de Livros
              </CardTitle>
            </CardHeader>
            <CardContent>{totalBooks}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookMarked className="h-5 w-5 text-primary" />
                Lendo Atualmente
              </CardTitle>
            </CardHeader>
            <CardContent>{currentlyReading.length}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Livros Finalizados
              </CardTitle>
            </CardHeader>
            <CardContent>{finishedBooks.length}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Páginas Lidas
              </CardTitle>
            </CardHeader>
            <CardContent>{totalPagesRead.toLocaleString()}</CardContent>
          </Card>
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

              <div className="mt-6 space-y-2 cursor-pointer">
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

      {/* overlay com spinner enquanto NÃO estiver pronto */}
      {!isReady && (
        <div
          aria-hidden
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
