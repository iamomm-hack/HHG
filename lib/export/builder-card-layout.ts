import type { BuilderCardLayout, TeamSize } from "@/types/builder-card";

const text = (centerX: number, baselineY: number, maxWidth: number, fontSize: number, minFontSize: number, fontFamily: string, color: string, letterSpacing = 0.5, strokeWidth = 0): BuilderCardLayout["name"] => ({
  centerX, baselineY, maxWidth, fontSize, minFontSize, fontFamily, fontWeight: 700, color, letterSpacing, strokeWidth,
});

export const builderCardLayouts: Record<TeamSize, BuilderCardLayout> = {
  1: {
    templateUrl: "/templates/hh-goa-builder-card-template-v3.jpg",
    templateWidth: 1280,
    templateHeight: 853,
    portraits: [{ centerX: 570, centerY: 393, radiusX: 196, radiusY: 224 }],
    memberNames: [],
    memberSocials: [],
    teamName: { ...text(1015, 344, 405, 36, 24, "Victor Mono", "#b92e59", 1, 1), fontWeight: 900 },
    name: text(1015, 407, 420, 58, 34, "Imbue", "#063d2f"),
    builderTitle: text(1015, 457, 405, 29, 18, "Victor Mono", "#b92e59", 1.1, 1),
    roleStack: text(1015, 496, 405, 18, 12, "Victor Mono", "#063d2f", 0.8, 0.9),
    builderNumberLabel: text(875, 677, 112, 14, 11, "Victor Mono", "#b92e59", 1.2, 0.65),
    builderNumber: text(875, 718, 90, 22, 15, "Victor Mono", "#b92e59", 1.7, 0.9),
    social: { centerX: 1015, y: 520, maxWidth: 405 },
    statement: { centerX: 1015, startY: 608, maxWidth: 405, maxLines: 2, maxFontSize: 19 },
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
      { ...text(697, 638, 300, 30, 20, "Victor Mono", "#063d2f", 0.8, 0.85), fontWeight: 900 },
      { ...text(1160, 638, 300, 30, 20, "Victor Mono", "#063d2f", 0.8, 0.85), fontWeight: 900 },
    ],
    memberSocials: [
      { centerX: 697, y: 650, maxWidth: 265 },
      { centerX: 1160, y: 650, maxWidth: 265 },
    ],
    teamName: text(930, 108, 430, 42, 26, "Imbue", "#063d2f"),
    name: text(930, 108, 430, 42, 26, "Imbue", "#063d2f"),
    builderTitle: text(820, 752, 520, 26, 18, "Victor Mono", "#b92e59", 1, 0.9),
    roleStack: text(820, 785, 500, 17, 12, "Victor Mono", "#063d2f", 0.7, 0.7),
    builderNumberLabel: text(1185, 778, 145, 15, 12, "Victor Mono", "#b92e59", 1.2, 0.6),
    builderNumber: text(1185, 820, 100, 22, 16, "Victor Mono", "#b92e59", 1.7, 0.9),
    social: { centerX: 655, y: 750, maxWidth: 330 },
    statement: { centerX: 1380, startY: 690, maxWidth: 400, maxLines: 2, maxFontSize: 19 },
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
    memberSocials: [
      { centerX: 454, y: 700, maxWidth: 230 },
      { centerX: 845, y: 700, maxWidth: 230 },
      { centerX: 1306, y: 700, maxWidth: 230 },
    ],
    teamName: text(850, 112, 650, 54, 32, "Imbue", "#063d2f"),
    name: text(850, 112, 650, 54, 32, "Imbue", "#063d2f"),
    builderTitle: text(850, 157, 620, 27, 17, "Victor Mono", "#b92e59", 1, 0.85),
    roleStack: text(850, 192, 610, 17, 12, "Victor Mono", "#063d2f", 0.7, 0.65),
    builderNumberLabel: text(1190, 776, 145, 15, 12, "Victor Mono", "#b92e59", 1.2, 0.6),
    builderNumber: text(1190, 818, 100, 22, 16, "Victor Mono", "#b92e59", 1.7, 0.9),
    social: { centerX: 850, y: 210, maxWidth: 360 },
    statement: { centerX: 850, startY: 758, maxWidth: 560, maxLines: 2, maxFontSize: 20 },
  },
};

export function getBuilderCardLayout(teamSize: TeamSize) {
  return builderCardLayouts[teamSize] ?? builderCardLayouts[1];
}
