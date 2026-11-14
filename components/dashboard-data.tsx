import { BookOpen, BookMarked, CheckCircle2, FileText } from "lucide-react";
import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { calculateBookStats } from "@/data/book-stats";
import type { Book } from "@/data/types";
import { getBooks } from "@/lib/reads";
import { RecentBooks } from "@/components/recent-books";

type ApiBook = Omit<Book, "id" | "genres" | "year"> & {
  id: string | number;
  genres?: Array<string | { name: string }> | null;
  year?: number | string | null;
};

export async function DashboardData() {
  const apiBooks: ApiBook[] = await getBooks();
  const books: Book[] = apiBooks.map((book) => ({
    ...book,
    id: String(book.id),
    genres:
      book.genres?.map((genre) =>
        typeof genre === "string" ? genre : genre.name
      ) ?? [],
    cover: book.cover || "/placeholder.svg",
    rating: book.rating ?? 0,
    status: book.status ?? undefined,
    year: typeof book.year === "number" ? book.year : undefined,
  }));
  const stats = calculateBookStats(books);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

      <div className="max-w-3xl">
        <RecentBooks books={books} />
      </div>
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
  icon: ReactNode;
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
