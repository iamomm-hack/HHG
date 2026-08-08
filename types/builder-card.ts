import type { PixelCrop } from "@/types/builder";

export type TeamSize = 1 | 2 | 3;

export interface BuilderCardDetails {
  teamName: string;
  name: string;
  role: string;
  stack: string[];
  xUsername: string;
  statement: string;
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
  teamSize: TeamSize;
  memberNames: string[];
  memberRoles: string[];
  memberXUsernames: string[];
  photoUrls: Array<string | null>;
  photoTransforms: PhotoTransform[];
  photoCrops: Array<PixelCrop | null>;
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
  templateUrl: string;
  templateWidth: number;
  templateHeight: number;
  portraits: Array<{ centerX: number; centerY: number; radiusX: number; radiusY: number; overscan?: number; fitMode?: "cover" | "oval-fit" }>;
  memberNames: LayoutTextRegion[];
  memberRoles: LayoutTextRegion[];
  memberTags: LayoutTextRegion[];
  memberSocials: Array<{ centerX: number; y: number; maxWidth: number }>;
  teamName: LayoutTextRegion;
  name: LayoutTextRegion;
  builderTitle: LayoutTextRegion;
  roleStack: LayoutTextRegion;
  builderNumberLabel: LayoutTextRegion;
  builderNumber: LayoutTextRegion;
  social: { centerX: number; y: number; maxWidth: number };
  statement: { centerX: number; startY: number; maxWidth: number; maxLines: number; maxFontSize: number; color?: string };
  showGlobalDetails?: boolean;
}

export interface BuilderCardExportResult {
  blob: Blob;
  filename: string;
  width: number;
  height: number;
}
