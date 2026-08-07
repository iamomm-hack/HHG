export const SHARE_CAPTION = "Goa called. Time to build. 🌴⚡\n\nJust framed an HH Goa 2026 Builder ID for @247pmstudio’s Hacker House Goa.\n\nCreate yours: https://hhg-locals.vercel.app/\n\n#FrameInGoa";
export function xIntent(url?: string) { return `https://x.com/intent/post?text=${encodeURIComponent(`${SHARE_CAPTION}${url ? `\n\n${url}` : ""}`)}`; }
