export const SHARE_CAPTION = "Goa called. I’m showing up to build. 🌴⚡\n\nJust generated my HH Goa 2026 Builder ID — less noise, more signal, and shipping on the sand.\n\nSee you at @247pmstudio’s Hacker House Goa.\n\n#FrameInGoa";
export function xIntent(url?: string) { return `https://x.com/intent/post?text=${encodeURIComponent(`${SHARE_CAPTION}${url ? `\n\n${url}` : ""}`)}`; }
