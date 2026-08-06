import type { PixelCrop } from "@/types/builder";

const MAX_BYTES = 20 * 1024 * 1024;
const MAX_SIDE = 4096;

export async function prepareImage(file: File): Promise<Blob> {
  if (file.size > MAX_BYTES) throw new Error("That photo is over 20 MB. Choose a smaller file.");
  const type = file.type.toLowerCase();
  const heic = type.includes("heic") || type.includes("heif") || /\.hei[cf]$/i.test(file.name);
  if (!heic && !["image/jpeg", "image/png", "image/webp"].includes(type)) throw new Error("Use a JPG, PNG, WEBP, HEIC, or HEIF photo.");
  let source: Blob = file;
  if (heic) {
    const convert = (await import("heic2any")).default;
    const out = await convert({ blob: file, toType: "image/jpeg", quality: 0.92 });
    source = Array.isArray(out) ? out[0] : out;
  }
  const bitmap = await createImageBitmap(source, { imageOrientation: "from-image" });
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  if (scale === 1) { bitmap.close(); return source; }
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d", { alpha: true })!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) => canvas.toBlob((b) => b ? resolve(b) : reject(new Error("Could not process this image.")), "image/jpeg", 0.92));
}

export function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image(); image.onload = () => resolve(image); image.onerror = () => reject(new Error("Photo could not be decoded.")); image.src = src;
  });
}

export function drawCropped(ctx: CanvasRenderingContext2D, image: HTMLImageElement, crop: PixelCrop | null, x: number, y: number, w: number, h: number) {
  const c = crop ?? centeredCrop(image, w / h);
  ctx.drawImage(image, c.x, c.y, c.width, c.height, x, y, w, h);
}

function centeredCrop(image: HTMLImageElement, aspect: number): PixelCrop {
  const sourceAspect = image.naturalWidth / image.naturalHeight;
  const width = sourceAspect > aspect ? image.naturalHeight * aspect : image.naturalWidth;
  const height = sourceAspect > aspect ? image.naturalHeight : image.naturalWidth / aspect;
  return { x: (image.naturalWidth - width) / 2, y: (image.naturalHeight - height) / 2, width, height };
}
