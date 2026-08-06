# HH Goa 2026 Builder Identity

A mobile-first Builder ID Card and profile-frame generator grounded in HH Goa's production visual identity. The photo workflow, cropping, title generation, previews, and PNG rendering all run locally in the browser. No account is required.

## Local development

Requirements: Node.js 20.9+ and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Production verification:

```bash
npm run build
npm start
```

## Exports

- Builder ID Card: exact 1536 × 1024 PNG
- Complete profile picture: exact 1080 × 1080 PNG
- Transparent frame-only graphic: exact 1080 × 1080 PNG
- ZIP: all three outputs, generated lazily

Exports use a dedicated Canvas renderer, not a screenshot of the scaled preview. Victor Mono and Imbue ship in the app bundle so canvas text remains reliable.

## Sharing and environment variables

`NEXT_PUBLIC_SITE_URL` is the public deployment origin. `BLOB_READ_WRITE_TOKEN` is optional and enables persistent, image-backed share pages through Vercel Blob.

The share flow is deliberately truthful:

1. When Web Share file support is available, the generated PNG `File` and caption go to the native share sheet.
2. With Vercel Blob configured, only the final flattened Builder Card is uploaded. A unique `/share/[id]` page supplies its image as Open Graph metadata, and X compose opens with that public URL.
3. Without storage, the PNG downloads, the caption is copied, X compose opens, and the app clearly tells the user to attach the downloaded image.

An X intent never claims to attach a local file.

## Image privacy

Original photos, normalized source images, and crop state stay on-device. The source is held in a temporary object URL, never local storage, and is revoked when replaced or when the app unmounts. Only a final flattened PNG is uploaded—and only when the user explicitly chooses Share and persistent storage is configured.

## Deploy to Vercel

Import the repository in Vercel or run `vercel`. Set `NEXT_PUBLIC_SITE_URL` to the production domain. To enable persistent sharing, create a Vercel Blob store and attach its `BLOB_READ_WRITE_TOKEN`; otherwise the built-in manual X fallback remains fully usable.

## Brand implementation

Production values inspected from hhgoa.com are used directly: `#0B6839`, `#FEE101`, `#FF0080`, Victor Mono, Imbue, the date/location stamp, day-log structure, and restrained Goa horizon signature.
