import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) return NextResponse.json({ error: "Share storage is not configured." }, { status: 503 });
  const { id } = await params;
  if (!/^[a-f0-9]{16}$/.test(id)) return NextResponse.json({ error: "Invalid share ID." }, { status: 400 });
  for (let attempt = 0; attempt < 15; attempt += 1) {
    const result = await list({ prefix: `hh-goa-shares/${id}.`, limit: 1 });
    const blob = result.blobs[0];
    if (blob) return NextResponse.redirect(blob.url, { status: 307, headers: { "Cache-Control": "public, max-age=31536000, immutable" } });
    if (attempt < 14) await wait(400);
  }
  return NextResponse.json({ error: "Share image is still processing." }, { status: 404, headers: { "Cache-Control": "no-store" } });
}
