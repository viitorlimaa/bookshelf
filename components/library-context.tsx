// context/LibraryContext.tsx
"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { Book } from "@/data/types";

interface LibraryContextValue {
  books: Book[];
  setBooks: (books: Book[]) => void;
  removeBook: (id: string) => void;
}

const LibraryContext = createContext<LibraryContextValue | undefined>(
  undefined
);

export const LibraryProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([]);
  // LibraryProvider.tsx
  useEffect(() => {
    async function fetchBooks() {
      const res = await fetch("/api/books");
      const data = await res.json();
      setBooks(data);
    }
    fetchBooks();
  }, []);

  const removeBook = (id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <LibraryContext.Provider value={{ books, setBooks, removeBook }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used within LibraryProvider");
  return ctx;
};
