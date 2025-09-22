"use client";

import { useBookStore } from "@/lib/book-store";
import { ReadingStatus } from "@/lib/types";
import { useMemo } from "react";

export default function DashboardContent() {
  const { getBooksByStatus } = useBookStore();
  const books = useBookStore((s) => s.books);

  const finishedBooks = getBooksByStatus(ReadingStatus.LIDO);

  const totalPagesRead = useMemo(() => {
    return finishedBooks.reduce((t, b) => t + (b.pages || 0), 0);
  }, [finishedBooks]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Total de páginas lidas: {totalPagesRead}</p>
    </div>
  );
}
