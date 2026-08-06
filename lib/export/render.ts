import { themes } from "@/data/themes";
import { stableHash } from "@/lib/builder-title/generate-title";
import { drawCropped } from "@/lib/image/process";
import type { ExportPayload } from "@/types/builder";

const mono = '"Victor Mono", monospace';
const display = 'Imbue, Georgia, serif';

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
}

function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxSize: number, minSize: number, family = display, weight = 700) {
  let size = maxSize;
  while (size > minSize) { ctx.font = `${weight} ${size}px ${family}`; if (ctx.measureText(text).width <= maxWidth) break; size -= 2; }
  return size;
}

function grid(ctx: CanvasRenderingContext2D, color: string, w: number, h: number) {
  ctx.strokeStyle = color; ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 72) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y < h; y += 72) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
}

function horizon(ctx: CanvasRenderingContext2D, y: number, w: number, color: string) {
  ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, y + 55);
  const points = [[0,18],[55,8],[105,24],[170,12],[245,27],[320,10],[390,17],[455,1],[515,15],[590,7],[660,22],[725,5],[790,20],[860,11],[930,25],[1000,9],[1080,18]];
  points.forEach(([x,d]) => ctx.lineTo(x, y + d)); ctx.lineTo(w, y + 70); ctx.closePath(); ctx.fill();
}

function stamp(ctx: CanvasRenderingContext2D, left: number, y: number, right: number, color: string, number: string) {
  ctx.font = `600 20px ${mono}`; ctx.fillStyle = color; ctx.textBaseline = "middle";
  ctx.fillText("GOA, INDIA · 28–31 OCT 2026", left, y);
  ctx.textAlign = "right"; ctx.fillText(number, right, y); ctx.textAlign = "left";
}

function qrBlock(ctx: CanvasRenderingContext2D, seed: string, x: number, y: number, size: number, color: string) {
  const cells = 9, cell = size / cells; ctx.fillStyle = color;
  for (let row=0; row<cells; row++) for (let col=0; col<cells; col++) {
    const finder = ((row < 3 || row > 5) && (col < 3 || col > 5));
    if (finder || ((stableHash(`${seed}:${row}:${col}`) >> ((row + col) % 15)) & 1)) ctx.fillRect(x + col*cell, y + row*cell, cell*.72, cell*.72);
  }
}

export async function renderBuilderCard(payload: ExportPayload) {
  await document.fonts.ready.catch(() => undefined);
  const canvas = document.createElement("canvas"); canvas.width = 1080; canvas.height = 1350;
  const ctx = canvas.getContext("2d")!; const t = themes[payload.theme];
  ctx.fillStyle = t.bg; ctx.fillRect(0,0,1080,1350); grid(ctx,t.grid,1080,1350);
  const glow=ctx.createRadialGradient(800,150,20,800,150,650); glow.addColorStop(0,`${t.accentB}77`); glow.addColorStop(1,"transparent"); ctx.fillStyle=glow; ctx.fillRect(0,0,1080,800);
  roundRect(ctx,32,32,1016,1286,42); ctx.strokeStyle="rgba(255,255,255,.18)"; ctx.lineWidth=2; ctx.stroke();
  stamp(ctx,76,92,1004,t.accentA,payload.number);
  ctx.font=`600 20px ${mono}`; ctx.fillStyle=t.muted; ctx.fillText(`${t.day} — ${t.name}`,76,144); ctx.textAlign="right"; ctx.fillText(t.note,1004,144); ctx.textAlign="left";
  const px=76,py=196,pw=928,ph=565; roundRect(ctx,px,py,pw,ph,32); ctx.save(); ctx.clip(); drawCropped(ctx,payload.photo,payload.cardCrop,px,py,pw,ph); const shade=ctx.createLinearGradient(0,py,0,py+ph); shade.addColorStop(.55,"transparent"); shade.addColorStop(1,"rgba(0,0,0,.58)"); ctx.fillStyle=shade;ctx.fillRect(px,py,pw,ph);ctx.restore();
  const ring=ctx.createLinearGradient(px,py,px+pw,py+ph); ring.addColorStop(0,t.accentA);ring.addColorStop(1,t.accentB);ctx.strokeStyle=ring;ctx.lineWidth=9;roundRect(ctx,px,py,pw,ph,32);ctx.stroke();
  ctx.fillStyle=t.text; const name=payload.details.name.toUpperCase(); const nameSize=fitText(ctx,name,740,78,44,display,700);ctx.font=`700 ${nameSize}px ${display}`;ctx.fillText(name,76,865);
  ctx.fillStyle=t.accentA;ctx.font=`700 34px ${mono}`;ctx.fillText(payload.title,76,920);
  ctx.fillStyle=t.muted;ctx.font=`600 22px ${mono}`;ctx.fillText(payload.details.role.toUpperCase(),76,967);
  const stacks=payload.details.stack.slice(0,4).join(" · ").toUpperCase();ctx.fillStyle=t.text;ctx.font=`600 19px ${mono}`;ctx.fillText(stacks,76,1010);
  if(payload.details.statement){ctx.fillStyle=t.muted;ctx.font=`500 20px ${mono}`; const s=payload.details.statement.length>76?`${payload.details.statement.slice(0,73)}…`:payload.details.statement;ctx.fillText(`“${s}”`,76,1062);}
  const handles=[payload.details.github&&`GH / @${payload.details.github.replace(/^@/,"")}`,payload.details.x&&`X / @${payload.details.x.replace(/^@/,"")}`].filter(Boolean).join("   ");
  ctx.fillStyle=t.muted;ctx.font=`600 17px ${mono}`;ctx.fillText(handles,76,1130);
  qrBlock(ctx,`${payload.details.name}${payload.number}`,892,846,112,t.accentA);
  horizon(ctx,1190,1080,payload.theme==="build"?"#343833":"#0B6839");
  ctx.fillStyle=t.accentA;ctx.font=`700 22px ${mono}`;ctx.fillText("#FRAMEINGOA",76,1268);ctx.textAlign="right";ctx.font=`700 34px ${display}`;ctx.fillText("गोवा  /  HH GOA 2026",1004,1267);ctx.textAlign="left";
  return canvas;
}

export async function renderProfile(payload: ExportPayload, frameOnly = false) {
  await document.fonts.ready.catch(() => undefined);
  const canvas=document.createElement("canvas");canvas.width=1080;canvas.height=1080;const ctx=canvas.getContext("2d")!;const t=themes[payload.theme];
  if(!frameOnly){ctx.fillStyle=t.bg;ctx.fillRect(0,0,1080,1080);grid(ctx,t.grid,1080,1080);ctx.save();ctx.beginPath();ctx.arc(540,520,405,0,Math.PI*2);ctx.clip();drawCropped(ctx,payload.photo,payload.profileCrop,135,115,810,810);ctx.restore();}
  const ring=ctx.createLinearGradient(170,150,900,900);ring.addColorStop(0,t.accentA);ring.addColorStop(.48,t.accentB);ring.addColorStop(1,"#0B6839");ctx.strokeStyle=ring;ctx.lineWidth=78;ctx.beginPath();ctx.arc(540,520,444,0,Math.PI*2);ctx.stroke();
  ctx.strokeStyle=frameOnly?"rgba(255,255,255,.95)":t.text;ctx.lineWidth=5;ctx.beginPath();ctx.arc(540,520,397,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle=t.bg;roundRect(ctx,252,20,576,70,35);ctx.fill();ctx.strokeStyle=t.accentA;ctx.lineWidth=3;ctx.stroke();
  ctx.fillStyle=t.accentA;ctx.textAlign="center";ctx.textBaseline="middle";ctx.font=`700 20px ${mono}`;ctx.fillText("HH GOA 2026 · BUILDER LOG",540,56);
  ctx.fillStyle=t.bg;roundRect(ctx,270,948,540,86,28);ctx.fill();ctx.strokeStyle=t.accentA;ctx.stroke();ctx.fillStyle=t.text;ctx.font=`700 20px ${mono}`;ctx.fillText("GOA · 28–31 OCT 2026  /  गोवा",540,983);ctx.font=`600 14px ${mono}`;ctx.fillStyle=t.accentA;ctx.fillText("#FRAMEINGOA",540,1012);ctx.textAlign="left";ctx.textBaseline="alphabetic";
  return canvas;
}

export function canvasBlob(canvas: HTMLCanvasElement) { return new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error("PNG rendering failed.")),"image/png")); }

export function downloadBlob(blob: Blob, filename: string) { const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000); }
