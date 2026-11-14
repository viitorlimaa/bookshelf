import { BookGridSkeleton } from "@/components/book-grid-skeleton";

export default function Loading() {
  return (
    <div
      aria-label="Carregando biblioteca"
      aria-busy="true"
      className="container mx-auto px-4 py-8 sm:px-6 lg:px-8"
    >
      <BookGridSkeleton />
    </div>
  );
}
