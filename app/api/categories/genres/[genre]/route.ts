import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${API_BASE}/genres/${params.id}`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error fetching genre:", error);
    return NextResponse.json({ error: "Failed to fetch genre" }, { status: 500 });
  }
}
