"use server";

import type { Book } from "@/data/types";
import { getBooks } from "@/lib/reads";
import {
  createBook as createBookRequest,
  deleteBook as deleteBookRequest,
  updateBook as updateBookRequest,
} from "@/lib/book-mutations";

export async function refreshBooks() {
  return getBooks();
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
