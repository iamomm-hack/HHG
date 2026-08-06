"use client";

import { themes } from "@/data/themes";
import type { ThemeId } from "@/types/builder";

interface Props { image: string | null; theme: ThemeId; cropPosition: string }

export function ProfileFramePreview({ image, theme, cropPosition }: Props) {
  const current = themes[theme];
  return <div className={`profile-preview theme-${theme}`} style={{ "--bg": current.bg, "--a": current.accentA, "--b": current.accentB } as React.CSSProperties}>
    <div className="profile-top">HH GOA 2026 · BUILDER LOG</div>
    <div className="profile-ring"><div className="profile-photo" style={image ? { backgroundImage: `url(${image})`, backgroundPosition: cropPosition } : {}}>{!image && <span>YOUR<br />PHOTO</span>}</div></div>
    <div className="profile-stamp">GOA · 28–31 OCT 2026 / गोवा<small>#FRAMEINGOA</small></div>
  </div>;
}
