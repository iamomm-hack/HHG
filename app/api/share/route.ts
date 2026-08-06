import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function hasBlobConnection() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

export function GET() {
  return NextResponse.json({ configured: hasBlobConnection() });
}

export async function POST(request: Request) {
  if (!hasBlobConnection()) return NextResponse.json({ error: "Share storage is not configured." }, { status: 503 });
  try {
    const body = await request.formData();
    const image = body.get("image");
    if (!(image instanceof File) || image.type !== "image/png") return NextResponse.json({ error: "A PNG is required." }, { status: 400 });
    if (image.size > 8 * 1024 * 1024) return NextResponse.json({ error: "PNG is too large." }, { status: 413 });
    const id = crypto.randomUUID().replaceAll("-", "").slice(0, 16);
    const blob = await put(`hh-goa-shares/${id}.png`, image, { access: "public", contentType: "image/png", addRandomSuffix: false });
    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const page = new URL(`/share/${id}`, origin); page.searchParams.set("image", blob.url);
    return NextResponse.json({ id, url: page.toString() });
  } catch { return NextResponse.json({ error: "Could not create the share page." }, { status: 500 }); }
}
