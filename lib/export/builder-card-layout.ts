import type { BuilderCardLayout } from "@/types/builder-card";

export const TEMPLATE_WIDTH = 1536;
export const TEMPLATE_HEIGHT = 1024;
export const BUILDER_CARD_WIDTH = 1536;
export const BUILDER_CARD_HEIGHT = 1024;
export const BUILDER_CARD_TEMPLATE_URL = "/templates/hh-goa-builder-card-template-v2.png";

export const builderCardLayout: BuilderCardLayout = {
  templateWidth: TEMPLATE_WIDTH,
  templateHeight: TEMPLATE_HEIGHT,
  portrait: { centerX: 669, centerY: 454, radiusX: 240, radiusY: 264 },
  name: {
    centerX: 1190,
    baselineY: 430,
    maxWidth: 460,
    fontSize: 72,
    minFontSize: 38,
    fontFamily: "Imbue",
    fontWeight: 700,
    color: "#063d2f",
    letterSpacing: 0.5,
  },
  builderTitle: {
    centerX: 1190,
    baselineY: 500,
    maxWidth: 440,
    fontSize: 34,
    minFontSize: 20,
    fontFamily: "Victor Mono",
    fontWeight: 700,
    color: "#b92e59",
    letterSpacing: 1.2,
    strokeWidth: 1.15,
  },
  roleStack: {
    centerX: 1190,
    baselineY: 555,
    maxWidth: 450,
    fontSize: 21,
    minFontSize: 13,
    fontFamily: "Victor Mono",
    fontWeight: 700,
    color: "#063d2f",
    letterSpacing: 0.8,
    strokeWidth: 1.05,
  },
  builderNumberLabel: {
    centerX: 1054,
    baselineY: 748,
    maxWidth: 150,
    fontSize: 17,
    minFontSize: 14,
    fontFamily: "Victor Mono",
    fontWeight: 700,
    color: "#b92e59",
    letterSpacing: 1.5,
    strokeWidth: 0.75,
  },
  builderNumber: {
    centerX: 1037,
    baselineY: 832,
    maxWidth: 96,
    fontSize: 25,
    minFontSize: 17,
    fontFamily: "Victor Mono",
    fontWeight: 700,
    color: "#b92e59",
    letterSpacing: 2,
    strokeWidth: 1.05,
  },
};
