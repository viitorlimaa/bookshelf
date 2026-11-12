"use server";

import type { Book } from "@/data/types";
import {
  createBook as createBookRequest,
  deleteBook as deleteBookRequest,
  updateBook as updateBookRequest,
} from "@/lib/books";

export async function createBook(data: Partial<Book>) {
  return createBookRequest(data);
}

export async function updateBook(id: string, data: Partial<Book>) {
  return updateBookRequest(id, data);
}

export async function deleteBook(id: string) {
  return deleteBookRequest(id);
}
