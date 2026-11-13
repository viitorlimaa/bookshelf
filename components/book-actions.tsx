"use client";

import { useRouter } from "next/navigation";
import { useLibrary } from "@/components/library-context";
import {
  createBook as createBookAction,
  deleteBook as deleteBookAction,
  refreshBooks as refreshBooksAction,
  updateBook as updateBookAction,
} from "@/app/actions/books";
import type { Book } from "@/data/types";

export function useBooksActions() {
  const router = useRouter();
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
    router.refresh();
  }

  async function editBook(id: string | undefined, data: Partial<Book>) {
    if (!id) return;
    await updateBookAction(id, data);
    await refreshBooks();
    router.refresh();
  }

  // 💥 Corrigido: deleta do backend e do contexto imediatamente
  async function deleteBook(id: string | undefined) {
    if (!id) return { success: false, error: "ID não fornecido" };

    try {
      const result = await deleteBookAction(id);

      if (result.success) {
        // remove o livro localmente (atualiza UI instantaneamente)
        removeBook(String(id));

        // pequeno atraso só pra garantir que o servidor terminou o revalidate
        await new Promise((r) => setTimeout(r, 200));
        router.refresh();
      }

      return result;
    } catch (err) {
      console.error("Erro ao deletar livro:", err);
      return {
        success: false,
        error: (err as any)?.message || "Erro desconhecido",
      };
    }
  }

  return { refreshBooks, createBook, editBook, deleteBook };
}
