// app/api/genres/route.ts
import { NextResponse } from "next/server";

const API_BASE = "https://db-bookshelf.onrender.com";

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/genres`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error fetching genres:", error);
    return NextResponse.json({ error: "Failed to fetch genres" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${API_BASE}/genres`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("❌ Error creating genre:", error);
    return NextResponse.json({ error: "Failed to create genre" }, { status: 500 });
  }
}
