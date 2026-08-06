import { BUILDER_CARD_HEIGHT, BUILDER_CARD_WIDTH } from "@/lib/export/builder-card-layout";
import { renderBuilderCard } from "@/lib/export/render-builder-card";
import type { BuilderCardExportResult, BuilderCardRenderInput } from "@/types/builder-card";

export function sanitizeBuilderFilename(name: string) {
  return name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 42) || "builder";
}

export async function exportBuilderCard(input: BuilderCardRenderInput): Promise<BuilderCardExportResult> {
  const canvas = document.createElement("canvas");
  await renderBuilderCard(canvas, input, { width: BUILDER_CARD_WIDTH, height: BUILDER_CARD_HEIGHT, debug: false });
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("The Builder Card PNG could not be created.")), "image/png"));
  return { blob, filename: `hh-goa-2026-${sanitizeBuilderFilename(input.details.name)}-builder-card.png`, width: canvas.width, height: canvas.height };
}
