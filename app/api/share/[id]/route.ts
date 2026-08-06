import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) return NextResponse.json({ error: "Share storage is not configured." }, { status: 503 });
  const { id } = await params;
  if (!/^[a-f0-9]{16}$/.test(id)) return NextResponse.json({ error: "Invalid share ID." }, { status: 400 });
  const result = await list({ prefix: `hh-goa-shares/${id}.png`, limit: 1 });
  const blob = result.blobs[0];
  return blob ? NextResponse.json({ id, image: blob.url }) : NextResponse.json({ error: "Share not found." }, { status: 404 });
}
