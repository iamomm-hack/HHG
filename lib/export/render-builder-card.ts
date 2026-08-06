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

function roundedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawXHandle(ctx: CanvasRenderingContext2D, username: string, scale: number) {
  const cleanUsername = username.replace(/^@+/, "").replace(/[^a-zA-Z0-9_]/g, "").slice(0, 39);
  if (!cleanUsername) return;

  const handle = `@${cleanUsername}`;
  let fontSize = 24 * scale;
  const iconSize = 38 * scale;
  const horizontalPadding = 18 * scale;
  const gap = 12 * scale;
  const height = 56 * scale;
  ctx.save();
  ctx.font = `700 ${fontSize}px "Victor Mono", monospace`;
  const maxTextWidth = 440 * scale - horizontalPadding * 2 - iconSize - gap;
  while (fontSize > 15 * scale && ctx.measureText(handle).width > maxTextWidth) {
    fontSize -= scale;
    ctx.font = `700 ${fontSize}px "Victor Mono", monospace`;
  }
  const textWidth = ctx.measureText(handle).width;
  const width = Math.min(440 * scale, Math.max(220 * scale, horizontalPadding * 2 + iconSize + gap + textWidth));
  const x = 1190 * scale - width / 2;
  const y = 610 * scale;

  roundedRectPath(ctx, x, y, width, height, 13 * scale);
  ctx.fillStyle = "rgba(246, 224, 177, 0.86)";
  ctx.fill();
  ctx.strokeStyle = "#063d2f";
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  const iconX = x + horizontalPadding + iconSize / 2;
  const iconY = y + height / 2;
  ctx.beginPath();
  ctx.arc(iconX, iconY, iconSize / 2, 0, Math.PI * 2);
  ctx.fillStyle = "#063d2f";
  ctx.fill();

  ctx.strokeStyle = "#f6e0b1";
  ctx.lineWidth = 3.2 * scale;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(iconX - 8 * scale, iconY - 10 * scale);
  ctx.lineTo(iconX + 8 * scale, iconY + 10 * scale);
  ctx.moveTo(iconX + 8 * scale, iconY - 10 * scale);
  ctx.lineTo(iconX - 8 * scale, iconY + 10 * scale);
  ctx.stroke();

  ctx.fillStyle = "#063d2f";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(handle, x + horizontalPadding + iconSize + gap, y + height / 2);
  ctx.restore();
}

function drawDebugOverlay(ctx: CanvasRenderingContext2D, scale: number) {
  const { portrait, name, builderTitle, roleStack, builderNumberLabel, builderNumber } = builderCardLayout;
  ctx.save(); ctx.strokeStyle = "#00e5ff"; ctx.fillStyle = "#00e5ff"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.ellipse(portrait.centerX * scale, portrait.centerY * scale, portrait.radiusX * scale, portrait.radiusY * scale, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo((portrait.centerX - 16) * scale, portrait.centerY * scale); ctx.lineTo((portrait.centerX + 16) * scale, portrait.centerY * scale); ctx.moveTo(portrait.centerX * scale, (portrait.centerY - 16) * scale); ctx.lineTo(portrait.centerX * scale, (portrait.centerY + 16) * scale); ctx.stroke();
  for (const [label, region] of [["NAME", name], ["TITLE", builderTitle], ["ROLE/STACK", roleStack], ["NUMBER LABEL", builderNumberLabel], ["NUMBER", builderNumber]] as const) {
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
  if (Math.abs(scaleX - scaleY) > 0.0001) throw new Error("Builder Card output must preserve the template aspect ratio.");
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
  const number = `#${input.details.builderNumber.replace(/\D/g, "").slice(-4).padStart(4, "0")}`;
  drawCenteredText(ctx, name, builderCardLayout.name, scaleX);
  drawCenteredText(ctx, name && role && stack ? title : "", builderCardLayout.builderTitle, scaleX);
  drawCenteredText(ctx, roleStack, builderCardLayout.roleStack, scaleX);
  drawXHandle(ctx, input.details.xUsername, scaleX);
  drawCenteredText(ctx, name ? "BUILDER NO." : "", builderCardLayout.builderNumberLabel, scaleX);
  drawCenteredText(ctx, name ? number : "", builderCardLayout.builderNumber, scaleX);
  if (options.debug && process.env.NODE_ENV !== "production") drawDebugOverlay(ctx, scaleX);
}
