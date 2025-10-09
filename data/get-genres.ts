// app/lib/getGenres.ts (servidor)
import { db } from "@/data/db";

export async function getGenresServer() {
  try {
    return await db.getGenres();
  } catch {
    return [];
  }
}
