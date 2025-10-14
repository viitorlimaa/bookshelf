import type { Book } from "@/data/types";
import { BookCard } from "@/components/book-card";

interface BookGridProps {
  books: Book[];
  onDelete?: (bookId: string) => void;
}

export function BookGrid({ books, onDelete }: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium">Nenhum livro encontrado</p>
        <p className="text-sm text-muted-foreground">
          Tente ajustar os filtros ou adicione novos livros
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onDelete={onDelete} />
      ))}
    </div>
  );
}
