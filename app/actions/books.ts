"use server";

import type { Book } from "@/data/types";
import { getBooks } from "@/lib/reads";
import { normalizeBook } from "@/data/utils";
import {
  createBook as createBookRequest,
  deleteBook as deleteBookRequest,
  updateBook as updateBookRequest,
} from "@/lib/book-mutations";

export async function refreshBooks() {
  const books = await getBooks();
  return books.map(normalizeBook);
}

export async function createBook(data: Partial<Book>) {
  return createBookRequest(data);
}

export async function updateBook(id: string, data: Partial<Book>) {
  return updateBookRequest(id, data);
}

export async function deleteBook(id: string) {
  return deleteBookRequest(id);
}
