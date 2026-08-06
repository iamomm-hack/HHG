import type { PixelCrop } from "@/types/builder";

export interface BuilderCardDetails {
  name: string;
  role: string;
  stack: string[];
  builderTitle: string;
  builderNumber: string;
}

export interface PhotoTransform {
  zoom: number;
  offsetX: number;
  offsetY: number;
}

export interface CropState {
  transform: PhotoTransform;
  pixels: PixelCrop | null;
}

export interface BuilderCardRenderInput {
  details: BuilderCardDetails;
  photoUrl: string | null;
  photoTransform: PhotoTransform;
  photoCrop: PixelCrop | null;
}

export interface LayoutTextRegion {
  centerX: number;
  baselineY: number;
  maxWidth: number;
  fontSize: number;
  minFontSize: number;
  fontFamily: string;
  fontWeight: number;
  color: string;
  letterSpacing?: number;
  strokeWidth?: number;
}

export interface BuilderCardLayout {
  templateWidth: number;
  templateHeight: number;
  portrait: { centerX: number; centerY: number; radiusX: number; radiusY: number };
  name: LayoutTextRegion;
  builderTitle: LayoutTextRegion;
  roleStack: LayoutTextRegion;
  builderNumber: LayoutTextRegion;
}

export interface BuilderCardExportResult {
  blob: Blob;
  filename: string;
  width: number;
  height: number;
}
