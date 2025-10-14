"use client";

import { useEffect, useState, useMemo } from "react";
import { calculateBookStats } from "@/data/book-stats";
import { BookOpen, BookMarked, CheckCircle2, FileText } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import type { Book } from "@/data/types";
import { BookGridSkeleton } from "@/components/book-grid-skeleton";

export function DashboardStats() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch("/api/books");
        const data = await res.json();
        const normalized: Book[] = data.map((b: any) => ({
          ...b,
          genres: b.genres?.map((g: any) => g.name) || [],
          cover: b.cover || "/placeholder.svg",
          rating: b.rating ?? 0,
          status: b.status ?? undefined,
          year: typeof b.year === "number" ? b.year : undefined,
        }));
        setBooks(normalized);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();

    // opcional: revalidar a cada 30s
    const interval = setInterval(fetchBooks, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => calculateBookStats(books), [books]);

  if (loading) return <BookGridSkeleton />;

  return (
    <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total de Livros"
        value={stats.total}
        icon={<BookOpen className="h-5 w-5 text-muted-foreground" />}
        subtitle="cadastrados"
      />
      <StatCard
        title="Lendo Atualmente"
        value={stats.reading}
        icon={<BookMarked className="h-5 w-5 text-muted-foreground" />}
        subtitle="em progresso"
      />
      <StatCard
        title="Livros Finalizados"
        value={stats.finished}
        icon={<CheckCircle2 className="h-5 w-5 text-muted-foreground" />}
        subtitle="concluídos"
      />
      <StatCard
        title="Páginas Lidas"
        value={stats.totalPages.toLocaleString("pt-BR")}
        icon={<FileText className="h-5 w-5 text-muted-foreground" />}
        subtitle="páginas totais"
      />
    </div>
  );
}

function StatCard({ title, value, icon, subtitle }: any) {
  return (
    <Card className="rounded-2xl shadow-sm border transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
