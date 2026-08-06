import { BUILDER_CARD_HEIGHT, BUILDER_CARD_TEMPLATE_URL, BUILDER_CARD_WIDTH, builderCardLayout } from "@/lib/export/builder-card-layout";
import { drawCoverImage } from "@/lib/image/draw-cover-image";
import { loadBrowserImage } from "@/lib/image/load-browser-image";
import type { BuilderCardRenderInput, LayoutTextRegion } from "@/types/builder-card";

interface RenderOptions { width?: number; height?: number; debug?: boolean }

export function normalizeDisplayText(value: string) {
  return value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim().toUpperCase();
}

export function truncateStackDisplay(stack: string[], limit = 3) {
  const visible = stack.map(normalizeDisplayText).filter(Boolean).slice(0, limit);
  return visible.join(" · ");
}

export function fitTextToWidth(ctx: CanvasRenderingContext2D, text: string, region: LayoutTextRegion, scale: number) {
  let size = region.fontSize;
  while (size > region.minFontSize) {
    ctx.font = `${region.fontWeight} ${size * scale}px "${region.fontFamily}", ${region.fontFamily === "Imbue" ? "Georgia, serif" : "monospace"}`;
    if (measureSpacedText(ctx, text, (region.letterSpacing ?? 0) * scale) <= region.maxWidth * scale) break;
    size -= 1;
  }
  return size;
}

function measureSpacedText(ctx: CanvasRenderingContext2D, text: string, spacing: number) {
  return ctx.measureText(text).width + Math.max(0, text.length - 1) * spacing;
}

function drawCenteredText(ctx: CanvasRenderingContext2D, text: string, region: LayoutTextRegion, scale: number) {
  if (!text) return;
  const size = fitTextToWidth(ctx, text, region, scale);
  ctx.font = `${region.fontWeight} ${size * scale}px "${region.fontFamily}", ${region.fontFamily === "Imbue" ? "Georgia, serif" : "monospace"}`;
  ctx.fillStyle = region.color;
  ctx.strokeStyle = region.color;
  ctx.lineJoin = "round";
  ctx.lineWidth = (region.strokeWidth ?? 0) * scale;
  ctx.textBaseline = "alphabetic";
  const spacing = (region.letterSpacing ?? 0) * scale;
  const width = measureSpacedText(ctx, text, spacing);
  let x = region.centerX * scale - width / 2;
  for (const character of text) {
    if (region.strokeWidth) ctx.strokeText(character, x, region.baselineY * scale);
    ctx.fillText(character, x, region.baselineY * scale);
    x += ctx.measureText(character).width + spacing;
  }
}

function drawDebugOverlay(ctx: CanvasRenderingContext2D, scale: number) {
  const { portrait, name, builderTitle, roleStack, builderNumber } = builderCardLayout;
  ctx.save(); ctx.strokeStyle = "#00e5ff"; ctx.fillStyle = "#00e5ff"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.ellipse(portrait.centerX * scale, portrait.centerY * scale, portrait.radiusX * scale, portrait.radiusY * scale, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo((portrait.centerX - 16) * scale, portrait.centerY * scale); ctx.lineTo((portrait.centerX + 16) * scale, portrait.centerY * scale); ctx.moveTo(portrait.centerX * scale, (portrait.centerY - 16) * scale); ctx.lineTo(portrait.centerX * scale, (portrait.centerY + 16) * scale); ctx.stroke();
  for (const [label, region] of [["NAME", name], ["TITLE", builderTitle], ["ROLE/STACK", roleStack], ["NUMBER", builderNumber]] as const) {
    const left = (region.centerX - region.maxWidth / 2) * scale; const y = region.baselineY * scale;
    ctx.strokeRect(left, y - region.fontSize * scale, region.maxWidth * scale, region.fontSize * 1.25 * scale);
    ctx.font = `${10 * scale}px monospace`; ctx.fillText(`${label} y:${region.baselineY}`, left, y - region.fontSize * scale - 5);
  }
  ctx.restore();
}

export async function renderBuilderCard(canvas: HTMLCanvasElement, input: BuilderCardRenderInput, options: RenderOptions = {}) {
  const width = options.width ?? BUILDER_CARD_WIDTH;
  const height = options.height ?? BUILDER_CARD_HEIGHT;
  const scaleX = width / builderCardLayout.templateWidth;
  const scaleY = height / builderCardLayout.templateHeight;
  if (Math.abs(scaleX - scaleY) > 0.0001) throw new Error("Builder Card output must preserve the template's 4:5 aspect ratio.");
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("Canvas rendering is unavailable in this browser.");
  ctx.clearRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
  await document.fonts.ready.catch(() => undefined);
  const template = await loadBrowserImage(BUILDER_CARD_TEMPLATE_URL, true);
  ctx.drawImage(template, 0, 0, width, height);
  if (input.photoUrl) {
    const photo = await loadBrowserImage(input.photoUrl);
    drawCoverImage(ctx, photo, { ...builderCardLayout.portrait, renderScale: scaleX, transform: input.photoTransform, sourceCrop: input.photoCrop });
  }
  const name = normalizeDisplayText(input.details.name).slice(0, 38);
  const title = normalizeDisplayText(input.details.builderTitle).slice(0, 42);
  const role = normalizeDisplayText(input.details.role);
  const stack = truncateStackDisplay(input.details.stack);
  const roleStack = [role, stack].filter(Boolean).join(" · ");
  const number = `BUILDER NO. #${input.details.builderNumber.replace(/\D/g, "").slice(-4).padStart(4, "0")}`;
  drawCenteredText(ctx, name, builderCardLayout.name, scaleX);
  drawCenteredText(ctx, name && role && stack ? title : "", builderCardLayout.builderTitle, scaleX);
  drawCenteredText(ctx, roleStack, builderCardLayout.roleStack, scaleX);
  drawCenteredText(ctx, name ? number : "", builderCardLayout.builderNumber, scaleX);
  if (options.debug && process.env.NODE_ENV !== "production") drawDebugOverlay(ctx, scaleX);
}
