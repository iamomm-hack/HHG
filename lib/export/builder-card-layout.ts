import type { BuilderCardLayout, TeamSize } from "@/types/builder-card";

const text = (centerX: number, baselineY: number, maxWidth: number, fontSize: number, minFontSize: number, fontFamily: string, color: string, letterSpacing = 0.5, strokeWidth = 0): BuilderCardLayout["name"] => ({
  centerX, baselineY, maxWidth, fontSize, minFontSize, fontFamily, fontWeight: 700, color, letterSpacing, strokeWidth,
});

export const builderCardLayouts: Record<TeamSize, BuilderCardLayout> = {
  1: {
    templateUrl: "/templates/hh-goa-builder-card-template-v4.jpg",
    templateWidth: 1280,
    templateHeight: 853,
    portraits: [{ centerX: 573, centerY: 399, radiusX: 203, radiusY: 225, fitMode: "oval-fit" }],
    memberNames: [],
    memberRoles: [],
    memberTags: [],
    memberSocials: [],
    teamName: { ...text(1015, 344, 405, 36, 24, "Victor Mono", "#b92e59", 1, 1), fontWeight: 900 },
    name: text(1015, 407, 420, 58, 34, "Imbue", "#fee101"),
    builderTitle: text(1015, 457, 405, 29, 18, "Victor Mono", "#b92e59", 1.1, 1),
    roleStack: text(1015, 496, 405, 18, 12, "Victor Mono", "#f6e0b1", 0.8, 0.9),
    builderNumberLabel: text(849, 625, 160, 15, 11, "Victor Mono", "#b92e59", 1.1, 0.7),
    builderNumber: text(849, 711, 92, 22, 15, "Victor Mono", "#b92e59", 1.5, 0.9),
    social: { centerX: 1015, y: 520, maxWidth: 405 },
    statement: { centerX: 1015, startY: 608, maxWidth: 405, maxLines: 2, maxFontSize: 19, color: "#f6e0b1" },
  },
  2: {
    templateUrl: "/templates/hh-goa-team-2-template-v2.jpg",
    templateWidth: 1536,
    templateHeight: 1024,
    portraits: [
      { centerX: 196, centerY: 580, radiusX: 116, radiusY: 120 },
      { centerX: 932, centerY: 580, radiusX: 116, radiusY: 120 },
    ],
    memberNames: [
      { ...text(548, 489, 300, 23, 14, "Victor Mono", "#f6e0b1", 0.7, 0.7), fontWeight: 900 },
      { ...text(1260, 489, 300, 23, 14, "Victor Mono", "#f6e0b1", 0.7, 0.7), fontWeight: 900 },
    ],
    memberRoles: [
      text(548, 560, 300, 21, 13, "Victor Mono", "#fee101", 0.6, 0.6),
      text(1260, 560, 300, 21, 13, "Victor Mono", "#fee101", 0.6, 0.6),
    ],
    memberTags: [
      text(548, 634, 300, 20, 13, "Victor Mono", "#ff0080", 0.5, 0.6),
      text(1260, 634, 300, 20, 13, "Victor Mono", "#ff0080", 0.5, 0.6),
    ],
    memberSocials: [],
    teamName: text(768, 359, 590, 38, 24, "Victor Mono", "#fee101", 1.2, 0.8),
    name: text(768, 359, 590, 38, 24, "Victor Mono", "#fee101", 1.2, 0.8),
    builderTitle: text(768, 745, 1, 1, 1, "Victor Mono", "#fee101"),
    roleStack: text(768, 745, 1, 1, 1, "Victor Mono", "#fee101"),
    builderNumberLabel: text(1380, 719, 145, 14, 11, "Victor Mono", "#ff0080", 1, 0.6),
    builderNumber: text(1380, 749, 110, 21, 15, "Victor Mono", "#fee101", 1.4, 0.8),
    social: { centerX: 768, y: 745, maxWidth: 1 },
    statement: { centerX: 768, startY: 745, maxWidth: 1, maxLines: 1, maxFontSize: 1 },
    showGlobalDetails: false,
  },
  3: {
    templateUrl: "/templates/hh-goa-team-3-template-v2.jpg",
    templateWidth: 1536,
    templateHeight: 1024,
    portraits: [
      { centerX: 157, centerY: 558, radiusX: 101, radiusY: 104 },
      { centerX: 657, centerY: 558, radiusX: 101, radiusY: 104 },
      { centerX: 1145, centerY: 558, radiusX: 101, radiusY: 104 },
    ],
    memberNames: [
      { ...text(408, 483, 190, 19, 12, "Victor Mono", "#f6e0b1", 0.5, 0.6), fontWeight: 900 },
      { ...text(906, 483, 190, 19, 12, "Victor Mono", "#f6e0b1", 0.5, 0.6), fontWeight: 900 },
      { ...text(1360, 483, 180, 19, 12, "Victor Mono", "#f6e0b1", 0.5, 0.6), fontWeight: 900 },
    ],
    memberRoles: [
      text(408, 551, 190, 18, 11, "Victor Mono", "#fee101", 0.4, 0.5),
      text(906, 551, 190, 18, 11, "Victor Mono", "#fee101", 0.4, 0.5),
      text(1360, 551, 180, 18, 11, "Victor Mono", "#fee101", 0.4, 0.5),
    ],
    memberTags: [
      text(408, 618, 190, 17, 11, "Victor Mono", "#ff0080", 0.4, 0.5),
      text(906, 618, 190, 17, 11, "Victor Mono", "#ff0080", 0.4, 0.5),
      text(1360, 618, 180, 17, 11, "Victor Mono", "#ff0080", 0.4, 0.5),
    ],
    memberSocials: [],
    teamName: text(768, 359, 590, 38, 24, "Victor Mono", "#fee101", 1.2, 0.8),
    name: text(768, 359, 590, 38, 24, "Victor Mono", "#fee101", 1.2, 0.8),
    builderTitle: text(768, 735, 1, 1, 1, "Victor Mono", "#fee101"),
    roleStack: text(768, 735, 1, 1, 1, "Victor Mono", "#fee101"),
    builderNumberLabel: text(1390, 704, 135, 13, 10, "Victor Mono", "#ff0080", 0.9, 0.5),
    builderNumber: text(1390, 733, 105, 20, 14, "Victor Mono", "#fee101", 1.3, 0.7),
    social: { centerX: 768, y: 735, maxWidth: 1 },
    statement: { centerX: 768, startY: 735, maxWidth: 1, maxLines: 1, maxFontSize: 1 },
    showGlobalDetails: false,
  },
};

export function getBuilderCardLayout(teamSize: TeamSize) {
  return builderCardLayouts[teamSize] ?? builderCardLayouts[1];
}
