import { BookForm } from "@/components/book-form"
import { db } from "@/db"
import { notFound } from "next/navigation"

interface EditBookPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const { id } = await params
  const book = await db.getById(id)

  if (!book) {
    notFound()
  }

  return (
     <div className="container max-w-3xl py-8 px-4 sm:px-6 lg:px-8 space-y-8">
    {/* Header */}
    <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">Editar Livro</h1>
        <p className="text-muted-foreground text-pretty">Atualize as informações do livro</p>
      </div>
      <BookForm book={book} />
    </div>
  )
}
