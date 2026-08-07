import type { BuilderCardLayout, TeamSize } from "@/types/builder-card";

const text = (centerX: number, baselineY: number, maxWidth: number, fontSize: number, minFontSize: number, fontFamily: string, color: string, letterSpacing = 0.5, strokeWidth = 0): BuilderCardLayout["name"] => ({
  centerX, baselineY, maxWidth, fontSize, minFontSize, fontFamily, fontWeight: 700, color, letterSpacing, strokeWidth,
});

export const builderCardLayouts: Record<TeamSize, BuilderCardLayout> = {
  1: {
    templateUrl: "/templates/hh-goa-builder-card-template-v2.png",
    templateWidth: 1672,
    templateHeight: 941,
    portraits: [{ centerX: 746, centerY: 424, radiusX: 226, radiusY: 250 }],
    memberNames: [],
    memberSocials: [],
    teamName: text(1295, 395, 500, 32, 22, "Victor Mono", "#b92e59", 1, 0.8),
    name: text(1295, 470, 520, 68, 38, "Imbue", "#063d2f"),
    builderTitle: text(1295, 525, 500, 33, 20, "Victor Mono", "#b92e59", 1.2, 1.15),
    roleStack: text(1295, 570, 500, 21, 13, "Victor Mono", "#063d2f", 0.8, 1.05),
    builderNumberLabel: text(1134, 755, 145, 17, 14, "Victor Mono", "#b92e59", 1.5, 0.75),
    builderNumber: text(1134, 805, 105, 25, 17, "Victor Mono", "#b92e59", 2, 1.05),
    social: { centerX: 1295, y: 615, maxWidth: 500 },
    statement: { centerX: 1295, startY: 665, maxWidth: 500, maxLines: 2, maxFontSize: 22 },
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
    memberSocials: [
      { centerX: 697, y: 626, maxWidth: 265 },
      { centerX: 1160, y: 626, maxWidth: 265 },
    ],
    teamName: text(930, 710, 700, 48, 31, "Imbue", "#063d2f"),
    name: text(930, 710, 700, 48, 31, "Imbue", "#063d2f"),
    builderTitle: text(930, 752, 660, 26, 18, "Victor Mono", "#b92e59", 1, 0.9),
    roleStack: text(930, 785, 640, 17, 12, "Victor Mono", "#063d2f", 0.7, 0.7),
    builderNumberLabel: text(1185, 778, 145, 15, 12, "Victor Mono", "#b92e59", 1.2, 0.6),
    builderNumber: text(1185, 820, 100, 22, 16, "Victor Mono", "#b92e59", 1.7, 0.9),
    social: { centerX: 655, y: 750, maxWidth: 330 },
    statement: { centerX: 810, startY: 830, maxWidth: 380, maxLines: 2, maxFontSize: 19 },
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
    memberSocials: [],
    teamName: text(850, 112, 650, 54, 32, "Imbue", "#063d2f"),
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
