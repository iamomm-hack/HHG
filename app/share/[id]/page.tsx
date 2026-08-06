import type { Metadata } from "next";
import Link from "next/link";

function validImage(value?: string) {
  if (!value) return undefined;
  try { const url = new URL(value); return url.protocol === "https:" && url.hostname.endsWith("public.blob.vercel-storage.com") ? url.toString() : undefined; } catch { return undefined; }
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ image?: string }> }): Promise<Metadata> {
  const image = validImage((await searchParams).image);
  return { title: "HH Goa 2026 Builder Identity", description: "Ready for HH Goa 2026. #FrameInGoa", openGraph: { title: "HH Goa 2026 Builder Identity", description: "Less Noise. More Signal. #FrameInGoa", images: image ? [{ url: image, width: 1536, height: 1024 }] : [], type: "website" }, twitter: { card: "summary_large_image", title: "HH Goa 2026 Builder Identity", description: "Ready for HH Goa 2026. #FrameInGoa", images: image ? [image] : [] } };
}

export default async function SharePage({ searchParams }: { searchParams: Promise<{ image?: string }> }) {
  const image=validImage((await searchParams).image);
  return <main className="share-page"><div className="share-page-card"><span>GOA, INDIA · 28–31 OCT 2026</span><h1>A builder just framed in Goa.</h1>{image?<img src={image} alt="Shared HH Goa 2026 Builder ID"/>:<div className="missing-share">This shared entry is unavailable.</div>}<p>#FrameInGoa · गोवा</p><Link href="/">Create your builder identity →</Link></div></main>;
}
