import { db } from "./data/db";
import fs from "fs";
import path from "path";
import type { ReadingStatus } from "./data/types";

interface LegacyBook {
  id: number;
  title: string;
  author: string;
  genre?: string;
  year?: number;
  pages?: number;
  rating?: number;
  synopsis?: string;
  cover?: string;
}

async function migrate() {
  const booksPath = path.resolve(process.cwd(), "books.json");
  const genresPath = path.resolve(process.cwd(), "genres.json");

  const booksJson: LegacyBook[] = JSON.parse(fs.readFileSync(booksPath, "utf-8"));
  const genresJson: string[] = JSON.parse(fs.readFileSync(genresPath, "utf-8"));

  // Criar gêneros primeiro
  for (const name of genresJson) {
    try {
      await db.addGenre(name);
    } catch (err) {
      console.warn(`Gênero já existe: ${name}`);
    }
  }

  // Criar livros
  for (const b of booksJson) {
    const payload = {
      title: b.title || "Título Desconhecido",
      author: b.author || "Autor Desconhecido",
      genres: b.genre ? [b.genre] : [],
      year: b.year ?? 0,
      pages: b.pages ?? 0,
      rating: b.rating ?? 0,
      synopsis: b.synopsis || "",
      cover: b.cover || "",
      currentPage: 0,
      status: "QUERO_LER" as ReadingStatus,
      isbn: undefined,
      notes: undefined,
    };

    try {
      await db.create(payload);
      console.log(`Livro migrado: ${b.title}`);
    } catch (err) {
      console.error(`Erro ao migrar livro: ${b.title}`, err);
    }
  }

  console.log("Migration concluída!");
}

migrate().catch(console.error);
