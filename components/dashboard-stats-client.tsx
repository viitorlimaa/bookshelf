"use client";

import { useEffect, useState, useMemo } from "react";
import { calculateBookStats } from "@/data/book-stats";
import { BookOpen, BookMarked, CheckCircle2, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookGridSkeleton } from "@/components/book-grid-skeleton";
import type { Book } from "@/data/types";

export function DashboardStatsClient() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true);
        const res = await fetch("/api/books");
        if (!res.ok) throw new Error("Erro ao buscar livros");

        const data = await res.json();

        const normalized: Book[] = data.map((b: any) => ({
          ...b,
          genres: b.genres?.map((g: any) => g.name) || [],
          cover: b.cover || "/placeholder.svg",
          rating: b.rating ?? 0,
          status: b.status ?? undefined,
          year: typeof b.year === "number" ? b.year : undefined,
          notes: b.notes ?? undefined,
          isbn: b.isbn ?? undefined,
        }));

        setBooks(normalized);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();

    // 🔁 Atualiza automaticamente a cada 30 segundos (opcional)
    const interval = setInterval(fetchBooks, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => calculateBookStats(books), [books]);

  if (loading) return <BookGridSkeleton />;
  if (error)
    return <p className="text-center text-red-500 mt-4">{error}</p>;

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

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
}) {
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
