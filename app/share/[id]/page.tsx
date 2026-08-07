import type { Metadata } from "next";
import { list } from "@vercel/blob";
import { cache } from "react";
import Link from "next/link";

function validImage(value?: string) {
  if (!value) return undefined;
  try { const url = new URL(value); return url.protocol === "https:" && url.hostname.endsWith("public.blob.vercel-storage.com") ? url.toString() : undefined; } catch { return undefined; }
}

const storedImage = cache(async (id: string) => {
  if (!/^[a-f0-9]{16}$/.test(id) || (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID)) return undefined;
  try {
    const result = await list({ prefix: `hh-goa-shares/${id}.`, limit: 1 });
    return validImage(result.blobs[0]?.url);
  } catch { return undefined; }
});

async function resolveImage(id: string, legacyImage?: string) {
  return (await storedImage(id)) || validImage(legacyImage);
}

export async function generateMetadata({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ image?: string }> }): Promise<Metadata> {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const stored = await resolveImage(id, query.image);
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const image = stored || (/^[a-f0-9]{16}$/.test(id) ? new URL(`/api/share/${id}`, origin).toString() : undefined);
  return { title: "Generated HH Goa 2026 Builder ID", description: "Open this generated HH Goa Builder ID. #FrameInGoa", openGraph: { title: "Generated HH Goa 2026 Builder ID", description: "Less Noise. More Signal. #FrameInGoa", images: image ? [{ url: image, secureUrl: image, width: 1536, height: 1024, alt: "Generated HH Goa 2026 Builder ID", type: "image/jpeg" }] : [], type: "website", url: `/share/${id}` }, twitter: { card: "summary_large_image", title: "Generated HH Goa 2026 Builder ID", description: "Open this generated HH Goa Builder ID. #FrameInGoa", images: image ? [{ url: image, alt: "Generated HH Goa 2026 Builder ID" }] : [] } };
}

export default async function SharePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ image?: string }> }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const image = (await resolveImage(id, query.image)) || (/^[a-f0-9]{16}$/.test(id) ? `/api/share/${id}` : undefined);
  return <main className="share-page"><div className="share-page-card"><span>GOA, INDIA · 28–31 OCT 2026</span><h1>Your Goa frame is here.</h1>{image?<><a className="share-image-link" href={image} aria-label="Open the full generated Builder ID image"><img src={image} alt="Generated HH Goa 2026 Builder ID"/></a><small className="share-image-hint">Tap the card to open the full image</small></>:<div className="missing-share">This shared entry is unavailable.</div>}<p>#FrameInGoa · गोवा</p><Link className="share-create-link" href="/">Create your builder identity →</Link></div></main>;
}
