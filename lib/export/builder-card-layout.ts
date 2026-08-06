import type { BuilderCardLayout } from "@/types/builder-card";

export const TEMPLATE_WIDTH = 1024;
export const TEMPLATE_HEIGHT = 1280;
export const BUILDER_CARD_WIDTH = 1080;
export const BUILDER_CARD_HEIGHT = 1350;
export const BUILDER_CARD_TEMPLATE_URL = "/templates/hh-goa-builder-card-template.png";

export const builderCardLayout: BuilderCardLayout = {
  templateWidth: TEMPLATE_WIDTH,
  templateHeight: TEMPLATE_HEIGHT,
  portrait: { centerX: 512, centerY: 432, radius: 228 },
  name: {
    centerX: 512,
    baselineY: 842,
    maxWidth: 748,
    fontSize: 94,
    minFontSize: 46,
    fontFamily: "Imbue",
    fontWeight: 700,
    color: "#173d2e",
    letterSpacing: 0.5,
  },
  builderTitle: {
    centerX: 512,
    baselineY: 918,
    maxWidth: 710,
    fontSize: 38,
    minFontSize: 23,
    fontFamily: "Victor Mono",
    fontWeight: 700,
    color: "#ad315c",
    letterSpacing: 1.2,
  },
  roleStack: {
    centerX: 512,
    baselineY: 970,
    maxWidth: 720,
    fontSize: 23,
    minFontSize: 15,
    fontFamily: "Victor Mono",
    fontWeight: 600,
    color: "#173d2e",
    letterSpacing: 0.8,
  },
  builderNumber: {
    centerX: 286,
    baselineY: 1125,
    maxWidth: 142,
    fontSize: 31,
    minFontSize: 22,
    fontFamily: "Victor Mono",
    fontWeight: 700,
    color: "#ad315c",
    letterSpacing: 3,
  },
};
