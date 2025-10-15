// app/dashboard/page.tsx

import { calculateBookStats } from "@/data/book-stats";
import { BookOpen, BookMarked, CheckCircle2, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RecentBooksClient } from "@/components/recent-books-client";
import { getBooks } from "@/lib/books";
import { RecentBooks } from "@/components/recent-books";

export default async function DashboardPage() {
  // Busca livros direto no servidor
  const books = await getBooks();
  const normalized = books.map((b: any) => ({
    ...b,
    genres: b.genres?.map((g: any) => g.name) || [],
    cover: b.cover || "/placeholder.svg",
    rating: b.rating ?? 0,
    status: b.status ?? undefined,
    year: typeof b.year === "number" ? b.year : undefined,
  }));

  const stats = calculateBookStats(normalized);

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-10 space-y-10 transition-colors">
      {/* Header */}
      <div className="space-y-2 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">BookShelf</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Acompanhe suas estatísticas de leitura e gerencie sua biblioteca
        </p>
      </div>

      {/* Estatísticas */}
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

      {/* Quick Nav + Recent */}
      <div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl shadow-sm border transition-colors">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Navegação Rápida
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Acesse rapidamente as principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button
              asChild
              className="justify-start rounded-xl shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              variant="outline"
            >
              <Link href="/library">
                <BookOpen className="mr-2 h-4 w-4" /> Ver Biblioteca Completa
              </Link>
            </Button>
            <Button
              asChild
              className="justify-start rounded-xl shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              variant="outline"
            >
              <Link href="/add">
                <BookMarked className="mr-2 h-4 w-4" /> Adicionar Novo Livro
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Atividade Recente (client-side) */}
        <RecentBooks books={books} />
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon }: any) {
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
