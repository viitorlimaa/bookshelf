import { BookForm } from "@/components/book-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AddBookPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-background px-4 sm:px-6 lg:px-8 py-12">
      {/* Header com botão de voltar */}
      <div className="flex items-center w-full max-w-3xl mb-8">
        <Link
          href="/library"
          className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md shadow-sm transition-colors duration-200"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--color-primary-foreground)"
          }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Link>
        <div className="ml-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
            Adicionar Novo Livro
          </h1>
          <p className="mt-1 text-sm sm:text-base text-muted-foreground">
            Preencha as informações do livro para adicionar à sua biblioteca
          </p>
        </div>
      </div>

      {/* Card centralizado para o formulário */}
      <div className="w-full max-w-2xl bg-card rounded-lg shadow-md p-8">
        <BookForm />
      </div>
    </div>
  );
}
