export const SHARE_CAPTION = "Ready for HH Goa 2026 🚀\nBuilt my official Builder Identity.\n\n#FrameInGoa";
export function xIntent(url?: string) { return `https://x.com/intent/post?text=${encodeURIComponent(`${SHARE_CAPTION}${url ? `\n\n${url}` : ""}`)}`; }
