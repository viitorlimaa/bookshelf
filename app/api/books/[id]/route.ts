import { db } from "@/db"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const book = await db.getById(id)

    if (!book) {
      return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 })
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error("Error fetching book:", error)
    return NextResponse.json({ error: "Erro ao buscar livro" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    const updatedBook = await db.update(id, body)

    if (!updatedBook) {
      return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 })
    }

    return NextResponse.json(updatedBook)
  } catch (error) {
    console.error("Error updating book:", error)
    return NextResponse.json({ error: "Erro ao atualizar livro" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const deleted = await db.delete(id)

    if (!deleted) {
      return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting book:", error)
    return NextResponse.json({ error: "Erro ao deletar livro" }, { status: 500 })
  }
}
