import { themes } from "@/data/themes";
import { drawCropped } from "@/lib/image/process";
import type { ExportPayload } from "@/types/builder";

const mono = '"Victor Mono", monospace';

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath(); ctx.roundRect(x, y, width, height, radius);
}

function grid(ctx: CanvasRenderingContext2D, color: string, width: number, height: number) {
  ctx.strokeStyle = color; ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 72) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
  for (let y = 0; y < height; y += 72) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
}

export async function renderProfile(payload: ExportPayload, frameOnly = false) {
  await document.fonts.ready.catch(() => undefined);
  const canvas = document.createElement("canvas"); canvas.width = 1080; canvas.height = 1080;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas rendering is unavailable in this browser.");
  const theme = themes[payload.theme];
  if (!frameOnly) {
    ctx.fillStyle = theme.bg; ctx.fillRect(0, 0, 1080, 1080); grid(ctx, theme.grid, 1080, 1080);
    ctx.save(); ctx.beginPath(); ctx.arc(540, 520, 405, 0, Math.PI * 2); ctx.clip();
    drawCropped(ctx, payload.photo, payload.profileCrop, 135, 115, 810, 810); ctx.restore();
  }
  const ring = ctx.createLinearGradient(170, 150, 900, 900); ring.addColorStop(0, theme.accentA); ring.addColorStop(.48, theme.accentB); ring.addColorStop(1, "#0B6839");
  ctx.strokeStyle = ring; ctx.lineWidth = 78; ctx.beginPath(); ctx.arc(540, 520, 444, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = frameOnly ? "rgba(255,255,255,.95)" : theme.text; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(540, 520, 397, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = theme.bg; roundRect(ctx, 252, 20, 576, 70, 35); ctx.fill(); ctx.strokeStyle = theme.accentA; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = theme.accentA; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = `700 20px ${mono}`; ctx.fillText("HH GOA 2026 · BUILDER LOG", 540, 56);
  ctx.fillStyle = theme.bg; roundRect(ctx, 270, 948, 540, 86, 28); ctx.fill(); ctx.strokeStyle = theme.accentA; ctx.stroke();
  ctx.fillStyle = theme.text; ctx.font = `700 20px ${mono}`; ctx.fillText("GOA · 28–31 OCT 2026  /  गोवा", 540, 983); ctx.font = `600 14px ${mono}`; ctx.fillStyle = theme.accentA; ctx.fillText("#FRAMEINGOA", 540, 1012);
  return canvas;
}

export function canvasBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("PNG rendering failed.")), "image/png"));
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob); const anchor = document.createElement("a");
  anchor.href = url; anchor.download = filename; document.body.appendChild(anchor); anchor.click(); anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
