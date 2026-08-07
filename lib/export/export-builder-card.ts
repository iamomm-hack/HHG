import { getBuilderCardLayout } from "@/lib/export/builder-card-layout";
import { renderBuilderCard } from "@/lib/export/render-builder-card";
import type { BuilderCardExportResult, BuilderCardRenderInput } from "@/types/builder-card";

export function sanitizeBuilderFilename(name: string) {
  return name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 42) || "builder";
}

export async function exportBuilderCard(input: BuilderCardRenderInput): Promise<BuilderCardExportResult> {
  const canvas = document.createElement("canvas");
  const layout = getBuilderCardLayout(input.teamSize);
  await renderBuilderCard(canvas, input, { width: layout.templateWidth, height: layout.templateHeight, debug: false });
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("The Builder Card PNG could not be created.")), "image/png"));
  return { blob, filename: `hh-goa-2026-${sanitizeBuilderFilename(input.details.name)}-builder-card.png`, width: canvas.width, height: canvas.height };
}

export async function exportBuilderSharePreview(input: BuilderCardRenderInput): Promise<Blob> {
  const canvas = document.createElement("canvas");
  const layout = getBuilderCardLayout(input.teamSize);
  const width = Math.min(1200, layout.templateWidth);
  const height = Math.round(width * layout.templateHeight / layout.templateWidth);
  await renderBuilderCard(canvas, input, { width, height, debug: false });
  return new Promise<Blob>((resolve, reject) => canvas.toBlob(
    (value) => value ? resolve(value) : reject(new Error("The share preview could not be created.")),
    "image/jpeg",
    0.84,
  ));
}
