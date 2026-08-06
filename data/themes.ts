import type { ThemeId } from "@/types/builder";

export interface ThemeSpec {
  id: ThemeId;
  day: string;
  name: string;
  note: string;
  bg: string;
  panel: string;
  text: string;
  muted: string;
  accentA: string;
  accentB: string;
  grid: string;
}

export const themes: Record<ThemeId, ThemeSpec> = {
  genesis: { id: "genesis", day: "day 01", name: "genesis", note: "where it all begins", bg: "#2a1714", panel: "#40221a", text: "#fff8e8", muted: "#e8bc94", accentA: "#FEE101", accentB: "#ff7d66", grid: "rgba(254,225,1,.13)" },
  signal: { id: "signal", day: "day 02", name: "signal", note: "problem · solution · market", bg: "#071f1a", panel: "#0B6839", text: "#f3ffe9", muted: "#a4d7bf", accentA: "#FEE101", accentB: "#45e1cf", grid: "rgba(69,225,207,.16)" },
  build: { id: "build", day: "day 03", name: "build", note: "heads down. ship or ship", bg: "#121312", panel: "#20231f", text: "#ffffff", muted: "#a7aaa3", accentA: "#FEE101", accentB: "#ededdf", grid: "rgba(255,255,255,.08)" },
  launch: { id: "launch", day: "day 04", name: "launch", note: "the world watches", bg: "#170f24", panel: "#2b1538", text: "#ffffff", muted: "#d9b9df", accentA: "#FEE101", accentB: "#FF0080", grid: "rgba(255,0,128,.15)" },
};
