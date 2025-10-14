// app/dashboard/page.tsx
import { BookOpen, BookMarked, CheckCircle2, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { RecentBooksClient } from "@/components/recent-books-client";
import { DashboardStatsClient } from "@/components/dashboard-stats-client";

export default async function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-10 space-y-10 transition-colors">
      {/* Header */}
      <div className="space-y-2 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">BookShelf</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Acompanhe suas estatísticas de leitura e gerencie sua biblioteca
        </p>
      </div>

      {/* 🔹 Estatísticas (client-side dinâmico, mas layout server-side) */}
      <DashboardStatsClient />

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

        {/* 🔹 Atividade Recente (client-side dinâmico) */}
        <RecentBooksClient />
      </div>
    </div>
  );
}
