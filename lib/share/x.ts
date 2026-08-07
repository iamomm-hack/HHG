const SHARE_INTRO = "Goa called. Time to build. 🌴⚡\n\nJust framed an HH Goa 2026 Builder ID for @247pmstudio’s Hacker House Goa.";
const CREATE_YOURS = "Create yours: https://hhg-locals.vercel.app/";

export const SHARE_CAPTION = `${SHARE_INTRO}\n\n#FrameInGoa\n\n${CREATE_YOURS}`;

export function xIntent(url?: string) {
  const generatedImageLink = url ? `\n\nYour generated ID:\n${url}` : "";
  const text = `${SHARE_INTRO}${generatedImageLink}\n\n#FrameInGoa\n\n${CREATE_YOURS}`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}
