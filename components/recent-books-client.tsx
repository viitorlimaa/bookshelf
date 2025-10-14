"use client";

import { useEffect, useState } from "react";
import { RecentBooks } from "@/components/recent-books";
import { BookGridSkeleton } from "@/components/book-grid-skeleton";
import type { Book } from "@/data/types";

export function RecentBooksClient() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch("/api/books");
        const data = await res.json();
        setBooks(data);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  if (loading) return <BookGridSkeleton />;

  return <RecentBooks books={books} />;
}
