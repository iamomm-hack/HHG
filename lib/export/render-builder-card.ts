import { getBuilderCardLayout } from "@/lib/export/builder-card-layout";
import { drawCoverImage } from "@/lib/image/draw-cover-image";
import { loadBrowserImage } from "@/lib/image/load-browser-image";
import type { BuilderCardLayout, BuilderCardRenderInput, LayoutTextRegion } from "@/types/builder-card";

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

function drawXHandle(ctx: CanvasRenderingContext2D, username: string, icon: HTMLImageElement, region: BuilderCardLayout["social"], scale: number, compact = false) {
  const cleanUsername = username.replace(/^@+/, "").replace(/[^a-zA-Z0-9_]/g, "").slice(0, 39);
  if (!cleanUsername) return;

  const handle = `@${cleanUsername}`;
  let fontSize = (compact ? 15 : 24) * scale;
  const iconSize = (compact ? 23 : 38) * scale;
  const horizontalPadding = (compact ? 10 : 18) * scale;
  const gap = (compact ? 7 : 12) * scale;
  const height = (compact ? 34 : 56) * scale;
  ctx.save();
  ctx.font = `700 ${fontSize}px "Victor Mono", monospace`;
  const maxTextWidth = region.maxWidth * scale - horizontalPadding * 2 - iconSize - gap;
  while (fontSize > (compact ? 11 : 15) * scale && ctx.measureText(handle).width > maxTextWidth) {
    fontSize -= scale;
    ctx.font = `700 ${fontSize}px "Victor Mono", monospace`;
  }
  const textWidth = ctx.measureText(handle).width;
  const width = Math.min(region.maxWidth * scale, Math.max((compact ? 125 : 190) * scale, horizontalPadding * 2 + iconSize + gap + textWidth));
  const x = region.centerX * scale - width / 2;
  const y = region.y * scale;

  roundedRectPath(ctx, x, y, width, height, (compact ? 8 : 13) * scale);
  ctx.fillStyle = "rgba(246, 224, 177, 0.86)";
  ctx.fill();
  ctx.strokeStyle = "#063d2f";
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  const iconX = x + horizontalPadding + iconSize / 2;
  const iconY = y + height / 2;
  ctx.save();
  ctx.beginPath();
  ctx.arc(iconX, iconY, iconSize / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(icon, iconX - iconSize / 2, iconY - iconSize / 2, iconSize, iconSize);
  ctx.restore();

  ctx.fillStyle = "#063d2f";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(handle, x + horizontalPadding + iconSize + gap, y + height / 2);
  ctx.restore();
}

function drawBuilderStatement(ctx: CanvasRenderingContext2D, statement: string, region: BuilderCardLayout["statement"], scale: number) {
  const cleanStatement = statement.replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 90);
  if (!cleanStatement) return;

  const maxWidth = region.maxWidth * scale;
  const maxLines = region.maxLines;
  ctx.save();
  const words = cleanStatement.split(" ");
  const wrapAt = (fontSize: number) => {
    ctx.font = `900 ${fontSize * scale}px "Victor Mono", monospace`;
    const wrapped: string[] = [];
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (ctx.measureText(candidate).width <= maxWidth || !current) current = candidate;
      else { wrapped.push(current); current = word; }
    }
    if (current) wrapped.push(current);
    return wrapped;
  };

  let fontSize = region.maxFontSize;
  let lines = wrapAt(fontSize);
  while (lines.length > 2 && fontSize > 16) {
    fontSize -= 1;
    lines = wrapAt(fontSize);
  }
  const lineHeight = (fontSize + 4) * scale;
  const visibleLines = lines.slice(0, maxLines);
  if (lines.length > maxLines) {
    let last = visibleLines[maxLines - 1];
    while (last.length > 1 && ctx.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1);
    visibleLines[maxLines - 1] = `${last.trimEnd()}…`;
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#063d2f";
  ctx.strokeStyle = "#063d2f";
  ctx.lineWidth = 0.55 * scale;
  ctx.lineJoin = "round";
  const startY = (region.startY - Math.max(0, visibleLines.length - 1) * (fontSize + 4) / 2) * scale;
  visibleLines.forEach((line, index) => {
    const y = startY + index * lineHeight;
    ctx.strokeText(line, region.centerX * scale, y, maxWidth);
    ctx.fillText(line, region.centerX * scale, y, maxWidth);
  });
  ctx.restore();
}

function redrawPortraitInnerBorder(ctx: CanvasRenderingContext2D, portrait: BuilderCardLayout["portraits"][number], scale: number) {
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(
    portrait.centerX * scale,
    portrait.centerY * scale,
    (portrait.radiusX + 1.5) * scale,
    (portrait.radiusY + 1.5) * scale,
    0,
    0,
    Math.PI * 2,
  );
  ctx.strokeStyle = "#173f2d";
  ctx.lineWidth = 3.5 * scale;
  ctx.stroke();
  ctx.restore();
}

function drawDebugOverlay(ctx: CanvasRenderingContext2D, layout: BuilderCardLayout, scale: number) {
  const { portraits, name, builderTitle, roleStack, builderNumberLabel, builderNumber } = layout;
  ctx.save(); ctx.strokeStyle = "#00e5ff"; ctx.fillStyle = "#00e5ff"; ctx.lineWidth = 1;
  for (const portrait of portraits) {
    ctx.beginPath(); ctx.ellipse(portrait.centerX * scale, portrait.centerY * scale, portrait.radiusX * scale, portrait.radiusY * scale, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo((portrait.centerX - 16) * scale, portrait.centerY * scale); ctx.lineTo((portrait.centerX + 16) * scale, portrait.centerY * scale); ctx.moveTo(portrait.centerX * scale, (portrait.centerY - 16) * scale); ctx.lineTo(portrait.centerX * scale, (portrait.centerY + 16) * scale); ctx.stroke();
  }
  for (const [label, region] of [["NAME", name], ["TITLE", builderTitle], ["ROLE/STACK", roleStack], ["NUMBER LABEL", builderNumberLabel], ["NUMBER", builderNumber]] as const) {
    const left = (region.centerX - region.maxWidth / 2) * scale; const y = region.baselineY * scale;
    ctx.strokeRect(left, y - region.fontSize * scale, region.maxWidth * scale, region.fontSize * 1.25 * scale);
    ctx.font = `${10 * scale}px monospace`; ctx.fillText(`${label} y:${region.baselineY}`, left, y - region.fontSize * scale - 5);
  }
  ctx.restore();
}

export async function renderBuilderCard(canvas: HTMLCanvasElement, input: BuilderCardRenderInput, options: RenderOptions = {}) {
  const layout = getBuilderCardLayout(input.teamSize);
  const width = options.width ?? layout.templateWidth;
  const height = options.height ?? layout.templateHeight;
  const scaleX = width / layout.templateWidth;
  const scaleY = height / layout.templateHeight;
  if (Math.abs(scaleX - scaleY) > 0.001) throw new Error("Builder Card output must preserve the template aspect ratio.");
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("Canvas rendering is unavailable in this browser.");
  ctx.clearRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
  await document.fonts.ready.catch(() => undefined);
  const template = await loadBrowserImage(layout.templateUrl, true);
  const hasXHandle = Boolean(input.details.xUsername || input.memberXUsernames.some((username) => username.trim()));
  const xIcon = hasXHandle ? await loadBrowserImage("/icons/x-logo.png", true) : null;
  ctx.drawImage(template, 0, 0, width, height);
  for (let index = 0; index < layout.portraits.length; index += 1) {
    const photoUrl = input.photoUrls[index];
    if (!photoUrl) continue;
    const photo = await loadBrowserImage(photoUrl);
    drawCoverImage(ctx, photo, { ...layout.portraits[index], renderScale: scaleX, transform: input.photoTransforms[index] ?? { zoom: 1, offsetX: 0, offsetY: 0 }, sourceCrop: input.photoCrops[index] ?? null });
    redrawPortraitInnerBorder(ctx, layout.portraits[index], scaleX);
  }
  if (input.teamSize > 1) {
    layout.memberNames.forEach((region, index) => {
      drawCenteredText(ctx, normalizeDisplayText(input.memberNames[index] ?? "").slice(0, 26), region, scaleX);
    });
  }
  if (input.teamSize > 1 && xIcon) {
    layout.memberSocials.forEach((region, index) => {
      drawXHandle(ctx, input.memberXUsernames[index] ?? "", xIcon, region, scaleX, true);
    });
  }
  const name = normalizeDisplayText(input.details.name).slice(0, 38);
  const teamName = normalizeDisplayText(input.details.teamName).slice(0, 38);
  const title = normalizeDisplayText(input.details.builderTitle).slice(0, 42);
  const role = normalizeDisplayText(input.details.role);
  const stack = truncateStackDisplay(input.details.stack);
  const roleStack = [role, stack].filter(Boolean).join(" · ");
  const number = `#${input.details.builderNumber.replace(/\D/g, "").slice(-4).padStart(4, "0")}`;
  if (input.teamSize === 1) drawCenteredText(ctx, teamName, layout.teamName, scaleX);
  drawCenteredText(ctx, name, layout.name, scaleX);
  drawCenteredText(ctx, name && role && stack ? title : "", layout.builderTitle, scaleX);
  drawCenteredText(ctx, roleStack, layout.roleStack, scaleX);
  if (xIcon) drawXHandle(ctx, input.details.xUsername, xIcon, layout.social, scaleX);
  drawBuilderStatement(ctx, input.details.statement, layout.statement, scaleX);
  drawCenteredText(ctx, name ? "BUILDER NO." : "", layout.builderNumberLabel, scaleX);
  drawCenteredText(ctx, name ? number : "", layout.builderNumber, scaleX);
  if (options.debug && process.env.NODE_ENV !== "production") drawDebugOverlay(ctx, layout, scaleX);
}
