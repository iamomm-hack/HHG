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
    const requestedId = body.get("id");
    if (!(image instanceof File) || !["image/png", "image/jpeg", "image/webp"].includes(image.type)) return NextResponse.json({ error: "A PNG, JPEG, or WEBP image is required." }, { status: 400 });
    if (image.size > 8 * 1024 * 1024) return NextResponse.json({ error: "PNG is too large." }, { status: 413 });
    const id = typeof requestedId === "string" && /^[a-f0-9]{16}$/.test(requestedId) ? requestedId : crypto.randomUUID().replaceAll("-", "").slice(0, 16);
    const extension = image.type === "image/jpeg" ? "jpg" : image.type === "image/webp" ? "webp" : "png";
    const blob = await put(`hh-goa-shares/${id}.${extension}`, image, {
      access: "public",
      contentType: image.type,
      addRandomSuffix: false,
      allowOverwrite: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      oidcToken: process.env.VERCEL_OIDC_TOKEN,
      storeId: process.env.BLOB_STORE_ID,
    });
    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const page = new URL(`/share/${id}`, origin);
    return NextResponse.json({ id, url: page.toString(), image: blob.url });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown Blob upload error.";
    console.error("HH Goa share upload failed:", detail);
    return NextResponse.json({ error: "Could not upload the X image preview.", detail }, { status: 500 });
  }
}
