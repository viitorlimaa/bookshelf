"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBookStore } from "@/lib/book-store";
import { Navigation } from "@/components/navigation";
import { BookCard } from "@/components/book-card";
import { SearchFilters } from "@/components/search-filters";
import { DeleteBookDialog } from "@/components/delete-book-dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function BibliotecaPage() {
  const { books, isLoading, setLoading } = useBookStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Filtro dos livros
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        searchQuery === "" ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGenre =
        selectedGenre === "all" || book.genre === selectedGenre;

      const matchesStatus =
        selectedStatus === "all" || book.status === selectedStatus;

      return matchesSearch && matchesGenre && matchesStatus;
    });
  }, [books, searchQuery, selectedGenre, selectedStatus]);

  const hasActiveFilters =
    searchQuery !== "" || selectedGenre !== "all" || selectedStatus !== "all";

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedGenre("all");
    setSelectedStatus("all");
  };

  const handleEditBook = (book: any) => {
    setLoading(true); // inicia spinner imediatamente
    router.push(`/editar/${book.id}`);
  };

  // Simula carregamento inicial (ex: fetch ou hydrate localStorage)
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800); // ajusta conforme necessário
    return () => clearTimeout(timer);
  }, [books, setLoading]);

  // Remove ?success da URL
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.replace("/biblioteca");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  if (isLoading) {
    return <LoadingSpinner />; // spinner full screen
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success && (
          <div className="p-3 mb-6 text-green-700 bg-green-100 rounded-md text-sm">
            Livro adicionado com sucesso!
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground text-balance">
              Minha Biblioteca
            </h1>
            <p className="text-muted-foreground mt-2 text-pretty">
              {filteredBooks.length}{" "}
              {filteredBooks.length === 1
                ? "livro encontrado"
                : "livros encontrados"}
            </p>
          </div>

          <Button asChild>
            <Link href="/adicionar" className="cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Livro
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <SearchFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedGenre={selectedGenre}
            onGenreChange={setSelectedGenre}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={handleEditBook}
                onDelete={(book) => <DeleteBookDialog book={book} />}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {hasActiveFilters
                ? "Nenhum livro encontrado"
                : "Sua biblioteca está vazia"}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto text-pretty">
              {hasActiveFilters
                ? "Tente ajustar os filtros de busca para encontrar o que procura."
                : "Comece adicionando seus primeiros livros à sua biblioteca pessoal."}
            </p>
            {hasActiveFilters ? (
              <Button variant="outline" onClick={handleClearFilters}>
                Limpar Filtros
              </Button>
            ) : (
              <Button asChild>
                <Link href="/adicionar">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Livro
                </Link>
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
