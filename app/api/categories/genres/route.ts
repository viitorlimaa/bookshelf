import { NextResponse } from "next/server";
import { createGenre } from "@/lib/genres";
import { getGenres } from "@/lib/reads";

// Métodos HTTP
export async function GET() {
  const genres = await getGenres();
  return NextResponse.json(genres);
}

export async function POST(req: Request) {
  const body = await req.json();
  const genre = await createGenre(body);
  return NextResponse.json(genre);
}
