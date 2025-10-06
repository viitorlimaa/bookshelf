import { PrismaClient } from "@prisma/client";
import type { Book as FrontendBook, ReadingStatus } from "@/data/types";

const prisma = new PrismaClient();

// ===============================
//  Função de mapeamento
// ===============================
function mapBookPrismaToBook(prismaBook: any): FrontendBook {
  const genresArray = prismaBook.genres?.map((g: any) => g.name) ?? [];

  return {
    id: prismaBook.id.toString(),
    title: prismaBook.title,
    author: prismaBook.author,
    genre: genresArray[0] ?? "", // compatibilidade com versões antigas
    genres: genresArray, // novo campo
    year: prismaBook.year,
    isbn: prismaBook.isbn ?? undefined,
    status: prismaBook.status as ReadingStatus,
    pages: prismaBook.pages,
    currentPage: prismaBook.currentPage,
    rating: prismaBook.rating ?? 0,
    cover: prismaBook.cover,
    synopsis: prismaBook.synopsis,
    notes: prismaBook.notes ?? undefined,
    createdAt: prismaBook.createdAt.toISOString(),
    updatedAt: prismaBook.updatedAt.toISOString(),
  };
}

function mapBooksPrismaToBooks(prismaBooks: any[]): FrontendBook[] {
  return prismaBooks.map(mapBookPrismaToBook);
}

// ===============================
//  Utilitário de ID
// ===============================
function toNumberId(id: string | number): number | null {
  const numericId = typeof id === "string" ? parseInt(id, 10) : id;
  return isNaN(numericId) ? null : numericId;
}

// ===============================
//  Banco de dados
// ===============================
export const db = {
  async getAll() {
    const books = await prisma.book.findMany({ include: { genres: true } });
    return mapBooksPrismaToBooks(books);
  },

  async getById(id: string | number) {
    const numericId = toNumberId(id);
    if (numericId === null) return null;

    const book = await prisma.book.findUnique({
      where: { id: numericId },
      include: { genres: true },
    });

    return book ? mapBookPrismaToBook(book) : null;
  },

  async create(data: {
    title: string;
    author: string;
    year: number;
    pages: number;
    rating: number;
    synopsis: string;
    cover: string;
    currentPage: number;
    status?: ReadingStatus;
    isbn?: string;
    notes?: string;
    genres?: string[];
  }) {
    const book = await prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        year: data.year,
        pages: data.pages,
        rating: data.rating,
        synopsis: data.synopsis,
        cover: data.cover,
        currentPage: data.currentPage,
        status: data.status ?? "QUERO_LER",
        isbn: data.isbn,
        notes: data.notes,
        genres: data.genres?.length
          ? {
              connectOrCreate: data.genres.map((name) => ({
                where: { name },
                create: { name },
              })),
            }
          : undefined,
      },
      include: { genres: true },
    });

    return mapBookPrismaToBook(book);
  },

  async update(id: string | number, data: any) {
    const numericId = toNumberId(id);
    if (numericId === null) return null;

    const book = await prisma.book.update({
      where: { id: numericId },
      data: {
        ...data,
        genres: data.genres?.length
          ? {
              set: [],
              connectOrCreate: data.genres.map((name: string) => ({
                where: { name },
                create: { name },
              })),
            }
          : undefined,
      },
      include: { genres: true },
    });

    return mapBookPrismaToBook(book);
  },

  async delete(id: string | number) {
    const numericId = toNumberId(id);
    if (numericId === null) return false;

    await prisma.book.delete({ where: { id: numericId } });
    return true;
  },

  async search(query: string) {
    const q = query.toLowerCase();
    const books = await prisma.book.findMany({ include: { genres: true } });
    const filtered = books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    );
    return mapBooksPrismaToBooks(filtered);
  },

  async filterByGenre(genre: string) {
    const books = await prisma.book.findMany({
      where: { genres: { some: { name: genre } } },
      include: { genres: true },
    });
    return mapBooksPrismaToBooks(books);
  },

  async filterByStatus(status: ReadingStatus) {
    const books = await prisma.book.findMany({
      where: { status },
      include: { genres: true },
    });
    return mapBooksPrismaToBooks(books);
  },

  async getGenres() {
    return prisma.genre.findMany();
  },

  async addGenre(name: string) {
    return prisma.genre.create({ data: { name } });
  },

  async removeGenre(id: string | number) {
    const numericId = toNumberId(id);
    if (numericId === null) return false;

    await prisma.genre.delete({ where: { id: numericId } });
    return true;
  },
};
