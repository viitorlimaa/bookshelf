// db.ts
import path from "path";
import fs from "fs/promises";
import type { Book } from "./types";

const booksPath = path.join(process.cwd(), "data", "books.json");
const genresPath = path.join(process.cwd(), "data", "genres.json");

// ===============================
//  Funções auxiliares de leitura/escrita
// ===============================
async function readBooks(): Promise<Book[]> {
  try {
    const data = await fs.readFile(booksPath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeBooks(books: Book[]) {
  await fs.writeFile(booksPath, JSON.stringify(books, null, 2), "utf-8");
}

async function readGenres(): Promise<string[]> {
  try {
    const data = await fs.readFile(genresPath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeGenres(genres: string[]) {
  await fs.writeFile(genresPath, JSON.stringify(genres, null, 2), "utf-8");
}

// ===============================
//  Banco de Livros (JSON)
// ==============================
export const db = {
  // Buscar todos os livros
  async getAll(): Promise<Book[]> {
    return await readBooks();
  },

  // Buscar livro por ID
  async getById(id: string): Promise<Book | null> {
    const books = await readBooks();
    return books.find((b) => b.id === id) ?? null;
  },

  // Criar novo livro
  async create(book: Omit<Book, "id">): Promise<Book> {
    const books = await readBooks();
    const now = new Date().toISOString();

    const newBook: Book = {
      ...book,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };

    books.push(newBook);
    await writeBooks(books);
    return newBook;
  },

  // Atualizar livro
  async update(id: string, data: Partial<Book>): Promise<Book | null> {
    const books = await readBooks();
    const idx = books.findIndex((b) => b.id === id);
    if (idx === -1) return null;

    const updatedBook: Book = {
      ...books[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    books[idx] = updatedBook;
    await writeBooks(books);
    return updatedBook;
  },

  // Excluir livro
  async delete(id: string): Promise<boolean> {
    const books = await readBooks();
    const filtered = books.filter((b) => b.id !== id);
    if (filtered.length === books.length) return false; // não achou
    await writeBooks(filtered);
    return true;
  },

  // Pesquisa por título ou autor
  async search(query: string): Promise<Book[]> {
    const books = await readBooks();
    const q = query.toLowerCase();
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q)
    );
  },

  // Filtrar por gênero
  async filterByGenre(genre: string): Promise<Book[]> {
    const books = await readBooks();
    return books.filter(
      (b) => (b.genre ?? "").toLowerCase() === genre.toLowerCase()
    );
  },

  // Filtrar por status de leitura
  async filterByStatus(status: string): Promise<Book[]> {
    const books = await readBooks();
    return books.filter(
      (b) => (b.status ?? "").toLowerCase() === status.toLowerCase()
    );
  },

  // ===============================
  //  GÊNEROS
  // ===============================

  // Listar todos os gêneros
  async getGenres(): Promise<string[]> {
    return await readGenres();
  },

  // Adicionar novo gênero
  async addGenre(genre: string): Promise<string[]> {
    const genres = await readGenres();
    if (!genres.includes(genre)) {
      genres.push(genre);
      await writeGenres(genres);
    }
    return genres;
  },

  // Remover gênero
  async removeGenre(genre: string): Promise<boolean> {
    const genres = await readGenres();
    const filtered = genres.filter(
      (g) => g.toLowerCase() !== genre.toLowerCase()
    );
    if (filtered.length === genres.length) return false; // não achou
    await writeGenres(filtered);
    return true;
  },
};
