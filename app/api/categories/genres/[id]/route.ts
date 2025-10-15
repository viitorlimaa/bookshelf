import { NextResponse } from "next/server";
import { getGenre } from "@/lib/genres";

// HTTP Methods
export async function GET(req: Request) {
  const id = req.url.split("/").pop()!;
  const genre = await getGenre(id);
  return NextResponse.json(genre);
}
