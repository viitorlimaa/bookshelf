import { NextResponse } from "next/server"
import { GENRES } from "@/types"

export async function GET() {
  try {
    return NextResponse.json(GENRES)
  } catch (error) {
    console.error("[v0] Error fetching categories:", error)
    return NextResponse.json({ error: "Erro ao buscar categorias" }, { status: 500 })
  }
}
