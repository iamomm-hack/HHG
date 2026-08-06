import type { BuilderCardLayout } from "@/types/builder-card";

export const TEMPLATE_WIDTH = 1120;
export const TEMPLATE_HEIGHT = 1400;
export const BUILDER_CARD_WIDTH = 1080;
export const BUILDER_CARD_HEIGHT = 1350;
export const BUILDER_CARD_TEMPLATE_URL = "/templates/hh-goa-builder-card-template-v2.png";

export const builderCardLayout: BuilderCardLayout = {
  templateWidth: TEMPLATE_WIDTH,
  templateHeight: TEMPLATE_HEIGHT,
  portrait: { centerX: 559, centerY: 470, radiusX: 239, radiusY: 276 },
  name: {
    centerX: 560,
    baselineY: 960,
    maxWidth: 720,
    fontSize: 80,
    minFontSize: 42,
    fontFamily: "Imbue",
    fontWeight: 700,
    color: "#063d2f",
    letterSpacing: 0.5,
  },
  builderTitle: {
    centerX: 560,
    baselineY: 1034,
    maxWidth: 670,
    fontSize: 36,
    minFontSize: 22,
    fontFamily: "Victor Mono",
    fontWeight: 700,
    color: "#b92e59",
    letterSpacing: 1.2,
    strokeWidth: 1.15,
  },
  roleStack: {
    centerX: 560,
    baselineY: 1090,
    maxWidth: 680,
    fontSize: 22,
    minFontSize: 14,
    fontFamily: "Victor Mono",
    fontWeight: 700,
    color: "#063d2f",
    letterSpacing: 0.8,
    strokeWidth: 1.05,
  },
  builderNumber: {
    centerX: 560,
    baselineY: 1146,
    maxWidth: 310,
    fontSize: 25,
    minFontSize: 18,
    fontFamily: "Victor Mono",
    fontWeight: 700,
    color: "#b92e59",
    letterSpacing: 3,
    strokeWidth: 1.05,
  },
};
