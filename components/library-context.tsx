"use client";

import React, { createContext, useContext, useState } from "react";
import type { Book } from "@/data/types";

interface LibraryContextValue {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  addBook: (book: Book) => void;
  updateBook: (book: Book) => void;
  removeBook: (id: string) => void;
}

const LibraryContext = createContext<LibraryContextValue | undefined>(
  undefined
);

export const LibraryProvider: React.FC<{
  initialBooks?: Book[];
  children: React.ReactNode;
}> = ({ initialBooks = [], children }) => {
  const [books, setBooks] = useState<Book[]>(initialBooks);

  const addBook = (book: Book) => setBooks((prev) => [book, ...prev]);
  const updateBook = (book: Book) =>
    setBooks((prev) => prev.map((b) => (b.id === book.id ? book : b)));
  const removeBook = (id: string) =>
    setBooks((prev) => prev.filter((b) => String(b.id) !== String(id)));

  return (
    <LibraryContext.Provider
      value={{ books, setBooks, addBook, updateBook, removeBook }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context)
    throw new Error("useLibrary must be used within a LibraryProvider");
  return context;
};
