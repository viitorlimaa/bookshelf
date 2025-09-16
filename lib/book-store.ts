"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Book, ReadingStatus } from "./types"
import { initialBooks } from "./data"

interface BookStore {
  books: Book[]
  addBook: (book: Omit<Book, "id" | "createdAt" | "updatedAt">) => void
  updateBook: (id: string, updates: Partial<Book>) => void
  deleteBook: (id: string) => void
  getBookById: (id: string) => Book | undefined
  getBooksByStatus: (status: ReadingStatus) => Book[]
  searchBooks: (query: string) => Book[]
  filterByGenre: (genre: string) => Book[]
}

export const useBookStore = create<BookStore>()(
  persist(
    (set, get) => ({
      books: initialBooks,

      addBook: (bookData) => {
        const newBook: Book = {
          ...bookData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({ books: [...state.books, newBook] }))
      },

      updateBook: (id, updates) => {
        set((state) => ({
          books: state.books.map((book) => (book.id === id ? { ...book, ...updates, updatedAt: new Date() } : book)),
        }))
      },

      deleteBook: (id) => {
        set((state) => ({
          books: state.books.filter((book) => book.id !== id),
        }))
      },

      getBookById: (id) => {
        return get().books.find((book) => book.id === id)
      },

      getBooksByStatus: (status) => {
        return get().books.filter((book) => book.status === status)
      },

      searchBooks: (query) => {
        const books = get().books
        const lowercaseQuery = query.toLowerCase()
        return books.filter(
          (book) =>
            book.title.toLowerCase().includes(lowercaseQuery) || book.author.toLowerCase().includes(lowercaseQuery),
        )
      },

      filterByGenre: (genre) => {
        return get().books.filter((book) => book.genre === genre)
      },
    }),
    {
      name: "bookshelf-storage",
    },
  ),
)
