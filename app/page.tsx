import { calculateBookStats } from "@/data/book-stats"
import { BookOpen, BookMarked, CheckCircle2, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { RecentBooks } from "@/components/recent-books"
import { Book } from "@/data/types"

export default async function DashboardPage() {
  const res = await fetch(`http://localhost:3000/api/books`, { cache: "no-store" });
   if (!res.ok) throw new Error("Erro ao buscar livros");
   let books: Book[] = await res.json();
  const stats = calculateBookStats(books)

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-10 space-y-10 transition-colors">
      {/* Header */}
      <div className="space-y-2 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">BookShelf</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Acompanhe suas estatísticas de leitura e gerencie sua biblioteca
        </p>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl shadow-sm border transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Livros</CardTitle>
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">cadastrados</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lendo Atualmente</CardTitle>
            <BookMarked className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.reading}</div>
            <p className="text-xs text-muted-foreground">em progresso</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livros Finalizados</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.finished}</div>
            <p className="text-xs text-muted-foreground">concluídos</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Páginas Lidas</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalPages.toLocaleString("pt-BR")}</div>
            <p className="text-xs text-muted-foreground">páginas totais</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Nav + Recent */}
      <div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl shadow-sm border transition-colors">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Navegação Rápida</CardTitle>
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
                <BookOpen className="mr-2 h-4 w-4" />
                Ver Biblioteca Completa
              </Link>
            </Button>
            <Button
              asChild
              className="justify-start rounded-xl shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              variant="outline"
            >
              <Link href="/add">
                <BookMarked className="mr-2 h-4 w-4" />
                Adicionar Novo Livro
              </Link>
            </Button>
          </CardContent>
        </Card>

        <RecentBooks books={books} />
      </div>
    </div>
  )
}