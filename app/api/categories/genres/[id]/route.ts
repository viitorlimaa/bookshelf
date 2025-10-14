import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE!;

export async function getGenre(id: string) {
  const res = await fetch(`${BASE_URL}/genres/${id}`);
  if (!res.ok) throw new Error("Erro ao buscar gênero");
  return res.json();
}

// HTTP Methods
export async function GET(req: Request) {
  const id = req.url.split("/").pop()!;
  const genre = await getGenre(id);
  return NextResponse.json(genre);
}
