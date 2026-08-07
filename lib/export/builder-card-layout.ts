import type { BuilderCardLayout, TeamSize } from "@/types/builder-card";

const text = (centerX: number, baselineY: number, maxWidth: number, fontSize: number, minFontSize: number, fontFamily: string, color: string, letterSpacing = 0.5, strokeWidth = 0): BuilderCardLayout["name"] => ({
  centerX, baselineY, maxWidth, fontSize, minFontSize, fontFamily, fontWeight: 700, color, letterSpacing, strokeWidth,
});

export const builderCardLayouts: Record<TeamSize, BuilderCardLayout> = {
  1: {
    templateUrl: "/templates/hh-goa-builder-card-template-v2.png",
    templateWidth: 1536,
    templateHeight: 1024,
    portraits: [{ centerX: 669, centerY: 454, radiusX: 245, radiusY: 264 }],
    memberNames: [],
    name: text(1190, 430, 460, 72, 38, "Imbue", "#063d2f"),
    builderTitle: text(1190, 500, 440, 34, 20, "Victor Mono", "#b92e59", 1.2, 1.15),
    roleStack: text(1190, 555, 450, 21, 13, "Victor Mono", "#063d2f", 0.8, 1.05),
    builderNumberLabel: text(1054, 748, 150, 17, 14, "Victor Mono", "#b92e59", 1.5, 0.75),
    builderNumber: text(1037, 832, 96, 25, 17, "Victor Mono", "#b92e59", 2, 1.05),
    social: { centerX: 1190, y: 610, maxWidth: 440 },
    statement: { centerX: 1190, startY: 700, maxWidth: 430, maxLines: 3, maxFontSize: 21 },
  },
  2: {
    templateUrl: "/templates/hh-goa-team-2-template.png",
    templateWidth: 1672,
    templateHeight: 941,
    portraits: [
      { centerX: 697, centerY: 400, radiusX: 142, radiusY: 160 },
      { centerX: 1160, centerY: 400, radiusX: 142, radiusY: 160 },
    ],
    memberNames: [
      { ...text(697, 612, 300, 30, 20, "Victor Mono", "#063d2f", 0.8, 0.85), fontWeight: 900 },
      { ...text(1160, 612, 300, 30, 20, "Victor Mono", "#063d2f", 0.8, 0.85), fontWeight: 900 },
    ],
    name: text(930, 650, 780, 58, 34, "Imbue", "#063d2f"),
    builderTitle: text(930, 695, 720, 28, 18, "Victor Mono", "#b92e59", 1, 0.9),
    roleStack: text(930, 730, 700, 18, 12, "Victor Mono", "#063d2f", 0.7, 0.7),
    builderNumberLabel: text(1185, 778, 145, 15, 12, "Victor Mono", "#b92e59", 1.2, 0.6),
    builderNumber: text(1185, 820, 100, 22, 16, "Victor Mono", "#b92e59", 1.7, 0.9),
    social: { centerX: 655, y: 750, maxWidth: 330 },
    statement: { centerX: 925, startY: 785, maxWidth: 420, maxLines: 2, maxFontSize: 22 },
  },
  3: {
    templateUrl: "/templates/hh-goa-team-3-template.png",
    templateWidth: 1672,
    templateHeight: 941,
    portraits: [
      { centerX: 454, centerY: 496, radiusX: 104, radiusY: 132 },
      { centerX: 845, centerY: 496, radiusX: 104, radiusY: 132 },
      { centerX: 1306, centerY: 496, radiusX: 104, radiusY: 132 },
    ],
    memberNames: [
      { ...text(454, 686, 285, 31, 20, "Victor Mono", "#063d2f", 0.7, 0.95), fontWeight: 900 },
      { ...text(845, 686, 285, 31, 20, "Victor Mono", "#063d2f", 0.7, 0.95), fontWeight: 900 },
      { ...text(1306, 686, 285, 31, 20, "Victor Mono", "#063d2f", 0.7, 0.95), fontWeight: 900 },
    ],
    name: text(850, 112, 650, 54, 32, "Imbue", "#063d2f"),
    builderTitle: text(850, 157, 620, 27, 17, "Victor Mono", "#b92e59", 1, 0.85),
    roleStack: text(850, 192, 610, 17, 12, "Victor Mono", "#063d2f", 0.7, 0.65),
    builderNumberLabel: text(1190, 776, 145, 15, 12, "Victor Mono", "#b92e59", 1.2, 0.6),
    builderNumber: text(1190, 818, 100, 22, 16, "Victor Mono", "#b92e59", 1.7, 0.9),
    social: { centerX: 850, y: 210, maxWidth: 360 },
    statement: { centerX: 850, startY: 716, maxWidth: 620, maxLines: 2, maxFontSize: 24 },
  },
};

export function getBuilderCardLayout(teamSize: TeamSize) {
  return builderCardLayouts[teamSize] ?? builderCardLayouts[1];
}
