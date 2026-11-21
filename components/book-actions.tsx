"use client";

import { useLibrary } from "@/components/library-context";
import {
  createBook as createBookAction,
  deleteBook as deleteBookAction,
  refreshBooks as refreshBooksAction,
  updateBook as updateBookAction,
} from "@/app/actions/books";
import type { Book } from "@/data/types";

export function useBooksActions() {
  const { setBooks, removeBook } = useLibrary();

  async function refreshBooks() {
    try {
      const fresh: Book[] = await refreshBooksAction();
      setBooks(fresh);
    } catch (err) {
      console.error("Erro ao atualizar lista de livros:", err);
    }
  }

  async function createBook(data: Partial<Book>) {
    await createBookAction(data);
    await refreshBooks();
  }

  async function editBook(id: string | undefined, data: Partial<Book>) {
    if (!id) return;
    await updateBookAction(id, data);
    await refreshBooks();
  }

  async function deleteBook(id: string | undefined) {
    if (!id) return { success: false, error: "ID não fornecido" };

    try {
      const result = await deleteBookAction(id);

      if (result.success) {
        removeBook(String(id));
      }

      return result;
    } catch (err) {
      console.error("Erro ao deletar livro:", err);
      const message =
        err instanceof Error ? err.message : "Erro desconhecido";
      return {
        success: false,
        error: message,
      };
    }
  }

  return { refreshBooks, createBook, editBook, deleteBook };
}
