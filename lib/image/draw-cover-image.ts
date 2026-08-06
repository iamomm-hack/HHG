import type { PhotoTransform } from "@/types/builder-card";
import type { PixelCrop } from "@/types/builder";

interface DrawCoverOptions {
  centerX: number;
  centerY: number;
  radiusX: number;
  radiusY: number;
  renderScale: number;
  transform: PhotoTransform;
  sourceCrop?: PixelCrop | null;
}

export function drawCoverImage(ctx: CanvasRenderingContext2D, image: HTMLImageElement, options: DrawCoverOptions) {
  const { renderScale, transform, sourceCrop } = options;
  const centerX = options.centerX * renderScale;
  const centerY = options.centerY * renderScale;
  const radiusX = options.radiusX * renderScale;
  const radiusY = options.radiusY * renderScale;
  const targetWidth = radiusX * 2;
  const targetHeight = radiusY * 2;
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.clip();

  if (sourceCrop && sourceCrop.width > 0 && sourceCrop.height > 0) {
    ctx.drawImage(image, sourceCrop.x, sourceCrop.y, sourceCrop.width, sourceCrop.height, centerX - radiusX, centerY - radiusY, targetWidth, targetHeight);
  } else {
    const baseScale = Math.max(targetWidth / image.naturalWidth, targetHeight / image.naturalHeight);
    const drawScale = baseScale * Math.max(1, transform.zoom);
    const width = image.naturalWidth * drawScale;
    const height = image.naturalHeight * drawScale;
    const x = centerX - width / 2 + transform.offsetX * renderScale;
    const y = centerY - height / 2 + transform.offsetY * renderScale;
    ctx.drawImage(image, x, y, width, height);
  }
  ctx.restore();
}
