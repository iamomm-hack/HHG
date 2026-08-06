export type ThemeId = "genesis" | "signal" | "build" | "launch";
export type PreviewMode = "card" | "profile";

export interface BuilderDetails {
  name: string;
  role: string;
  stack: string[];
  x: string;
  statement: string;
}

export interface CropPoint { x: number; y: number }
export interface PixelCrop { x: number; y: number; width: number; height: number }
export interface CropConfig {
  crop: CropPoint;
  zoom: number;
  pixels: PixelCrop | null;
}

export interface ExportPayload {
  details: BuilderDetails;
  title: string;
  number: string;
  theme: ThemeId;
  photo: HTMLImageElement;
  cardCrop: PixelCrop | null;
  profileCrop: PixelCrop | null;
}
