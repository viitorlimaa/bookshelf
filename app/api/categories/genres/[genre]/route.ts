import { NextResponse } from "next/server";


export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE!}/genres/${params.id}`, {
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("❌ Erro ao buscar gênero:", err);
    return NextResponse.json(
      { error: "Erro ao buscar gênero" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE!}/genres/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("❌ Erro ao atualizar gênero:", err);
    return NextResponse.json(
      { error: "Erro ao atualizar gênero" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE!}/genres/${params.id}`, {
      method: "DELETE",
    });
    return NextResponse.json({}, { status: res.status });
  } catch (err) {
    console.error("❌ Erro ao deletar gênero:", err);
    return NextResponse.json(
      { error: "Erro ao deletar gênero" },
      { status: 500 }
    );
  }
}
